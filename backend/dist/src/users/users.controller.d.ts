import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(userData: Partial<User>): Promise<User>;
    update(id: string, userData: Partial<User>): Promise<User>;
    remove(id: string): Promise<void>;
}
