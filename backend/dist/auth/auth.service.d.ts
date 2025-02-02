import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRoleMapping } from '../entities/user-role-mapping.entity';
import { UsersService } from '../users/users.service';
export declare class AuthService implements OnModuleInit {
    private readonly userRepository;
    private readonly userRoleMappingRepository;
    private readonly jwtService;
    private usersService;
    constructor(userRepository: Repository<User>, userRoleMappingRepository: Repository<UserRoleMapping>, jwtService: JwtService, usersService: UsersService);
    onModuleInit(): Promise<void>;
    private ensureSuperAdmin;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(userData: Partial<User>): Promise<Omit<User, 'password'>>;
    validateToken(token: string): Promise<any>;
}
