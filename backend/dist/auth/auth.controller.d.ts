import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginData: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            roles: import("../entities/role.enum").UserRole[];
            id: number;
            email: string;
            fullName: string;
            bio: string;
            profileImage: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            news: import("../entities/news.entity").News[];
            userRoleMappings: import("../entities/user-role-mapping.entity").UserRoleMapping[];
        };
    }>;
    register(registerData: any): Promise<Omit<import("../entities/user.entity").User, "password">>;
    getProfile(req: any): any;
}
