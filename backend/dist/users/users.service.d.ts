import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRoleMapping } from '../entities/user-role-mapping.entity';
import { UserRole } from '../entities/role.enum';
export declare class UsersService {
    private readonly userRepository;
    private readonly userRoleMappingRepository;
    constructor(userRepository: Repository<User>, userRoleMappingRepository: Repository<UserRoleMapping>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(userData: Partial<User>): Promise<User>;
    update(id: number, userData: Partial<User>): Promise<User>;
    delete(id: number): Promise<void>;
    addRole(userId: number, role: UserRole, grantedBy?: number): Promise<void>;
    removeRole(userId: number, role: UserRole): Promise<void>;
}
