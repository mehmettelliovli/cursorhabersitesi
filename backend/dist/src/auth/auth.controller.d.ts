import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginData: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    register(registerData: any): Promise<Omit<import("../entities/user.entity").User, "password">>;
}
