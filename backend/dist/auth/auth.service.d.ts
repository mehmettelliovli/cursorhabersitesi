import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRoleMapping } from '../entities/user-role-mapping.entity';
import { UserRole } from '../entities/role.enum';
export declare class AuthService {
    private readonly userRepository;
    private readonly userRoleMappingRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, userRoleMappingRepository: Repository<UserRoleMapping>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginData: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            roles: UserRole[];
            id: number;
            email: string;
            fullName: string;
            bio: string;
            profileImage: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            news: import("../entities/news.entity").News[];
            userRoleMappings: UserRoleMapping[];
        };
    }>;
    register(userData: Partial<User>): Promise<Omit<User, 'password'>>;
    validateToken(token: string): Promise<any>;
}
