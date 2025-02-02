import { User } from './user.entity';
export declare class News {
    id: number;
    title: string;
    content: string;
    category: string;
    viewCount: number;
    imageUrl: string;
    author: User;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
}
