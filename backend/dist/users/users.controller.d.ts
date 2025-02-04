import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/role.enum';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Partial<User>[]>;
    getProfile(req: any): Promise<User>;
    findOne(id: string): Promise<User>;
    create(createUserDto: any): Promise<User>;
    update(id: string, updateUserDto: any, req: any): Promise<User>;
    remove(id: string): Promise<void>;
    assignRole(id: string, role: UserRole): Promise<User>;
}
