import { News } from './news.entity';
import { UserRole } from './role.enum';
export declare class User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    bio: string;
    profileImage: string;
    isActive: boolean;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    news: News[];
}
