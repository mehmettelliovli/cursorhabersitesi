import { Repository, DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/role.enum';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<Partial<User>[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    create(createUserDto: DeepPartial<User>): Promise<User>;
    update(id: number, updateUserDto: Partial<User>): Promise<User>;
    delete(id: number): Promise<void>;
    assignRole(id: number, role: UserRole): Promise<User>;
}
