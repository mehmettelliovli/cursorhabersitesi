import { News } from './news.entity';
import { UserRoleMapping } from './user-role-mapping.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    bio: string;
    profileImage: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    news: News[];
    roleMappings: UserRoleMapping[];
}
