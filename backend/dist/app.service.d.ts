import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { User } from './entities/user.entity';
export declare class AppService {
    private readonly newsRepository;
    private readonly userRepository;
    constructor(newsRepository: Repository<News>, userRepository: Repository<User>);
    getHello(): string;
    getDashboardStats(): Promise<{
        newsCount: number;
        userCount: number;
        latestNews: News[];
        topAuthors: any[];
    }>;
}
