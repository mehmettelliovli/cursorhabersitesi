import { Repository } from 'typeorm';
import { News } from '../entities/news.entity';
export declare class NewsService {
    private readonly newsRepository;
    constructor(newsRepository: Repository<News>);
    findAll(): Promise<News[]>;
    findOne(id: number): Promise<News>;
    create(newsData: any, author: any): Promise<News>;
    update(id: number, newsData: any): Promise<News>;
    delete(id: number): Promise<void>;
    findMostViewed(): Promise<News[]>;
    findByCategory(category: string): Promise<News[]>;
    incrementViewCount(id: number): Promise<void>;
}
