import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: Partial<User>): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      roles: [1000],
    });

    const savedUser = await this.userRepository.save(newUser);
    const userObject = Array.isArray(savedUser) ? savedUser[0] : savedUser;

    // Tip güvenliği için açık bir şekilde obje oluşturuyoruz
    const resultObject = {
      id: userObject.id,
      username: userObject.username,
      email: userObject.email,
      fullName: userObject.fullName,
      bio: userObject.bio,
      profileImage: userObject.profileImage,
      roles: userObject.roles,
      isActive: userObject.isActive,
      createdAt: userObject.createdAt,
      news: userObject.news,
    };

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