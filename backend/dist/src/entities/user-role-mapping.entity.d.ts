import { User } from './user.entity';
import { UserRole } from './role.enum';
export declare class UserRoleMapping {
    id: number;
    user: User;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    expiresAt: Date;
    grantedBy: number;
}
