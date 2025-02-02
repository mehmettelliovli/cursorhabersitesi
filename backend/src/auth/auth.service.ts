import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRoleMapping } from '../entities/user-role-mapping.entity';
import { UserRole } from '../entities/role.enum';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRoleMapping)
    private readonly userRoleMappingRepository: Repository<UserRoleMapping>,
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async onModuleInit() {
    await this.ensureSuperAdmin();
  }

  private async ensureSuperAdmin() {
    const email = 'mehmet_developer@hotmail.com';
    const password = 'mehmet61';
    const fullName = 'Super Admin';

    try {
      let superAdmin = await this.usersService.findByEmail(email);

      if (!superAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        superAdmin = await this.usersService.create({
          email,
          password: hashedPassword,
          fullName,
        });

        // Süper admin rolünü ekle
        await this.usersService.addRole(superAdmin.id, UserRole.SUPER_ADMIN);
        console.log('Süper admin kullanıcısı başarıyla oluşturuldu.');
      }
    } catch (error) {
      console.error('Süper admin oluşturulurken hata:', error);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roleMappings?.map(rm => rm.role) || [],
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: Partial<User>): Promise<Omit<User, 'password'>> {
    // Email kontrolü
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });
    
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(newUser);

    // Yeni kullanıcıya varsayılan USER rolünü ata
    const roleMapping = this.userRoleMappingRepository.create({
      user: savedUser,
      role: UserRole.USER,
      isActive: true
    });
    await this.userRoleMappingRepository.save(roleMapping);

    // Remove password from response
    const { password, ...resultObject } = savedUser;
    return resultObject;
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
} 