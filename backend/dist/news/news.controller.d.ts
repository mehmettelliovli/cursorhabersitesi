import { NewsService } from './news.service';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    findAll(req: any): Promise<import("../entities/news.entity").News[]>;
    findLatest(limit?: number): Promise<import("../entities/news.entity").News[]>;
    findMostViewed(limit?: number): Promise<import("../entities/news.entity").News[]>;
    findByCategory(id: string): Promise<import("../entities/news.entity").News[]>;
    findOne(id: string, req: any): Promise<import("../entities/news.entity").News>;
    create(createNewsDto: any, req: any): Promise<import("../entities/news.entity").News>;
    update(id: string, updateNewsDto: any, req: any): Promise<import("../entities/news.entity").News>;
    remove(id: string, req: any): Promise<void>;
}
