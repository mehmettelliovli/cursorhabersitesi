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
            id: any;
            email: any;
            fullName: any;
            role: any;
        };
    }>;
    register(registerData: any): Promise<{
        id: number;
        email: string;
        fullName: string;
        bio: string;
        profileImage: string;
        isActive: boolean;
        role: import("../entities/role.enum").UserRole;
        createdAt: Date;
        updatedAt: Date;
        news: import("../entities/news.entity").News[];
    }>;
    getProfile(req: any): any;
}
