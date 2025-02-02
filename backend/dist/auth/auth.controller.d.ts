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
            roles: any;
        };
    }>;
    register(registerData: any): Promise<Omit<import("../entities/user.entity").User, "password">>;
    getProfile(req: any): any;
}
