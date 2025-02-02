import { NewsService } from './news.service';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    findAll(): Promise<import("../entities/news.entity").News[]>;
    findLatest(limit?: number): Promise<import("../entities/news.entity").News[]>;
    findMostViewed(limit?: number): Promise<import("../entities/news.entity").News[]>;
    findByCategory(id: string): Promise<import("../entities/news.entity").News[]>;
    findOne(id: string): Promise<import("../entities/news.entity").News>;
    create(newsData: any, req: any): Promise<import("../entities/news.entity").News>;
    update(id: string, newsData: any): Promise<import("../entities/news.entity").News>;
    remove(id: string): Promise<void>;
}
