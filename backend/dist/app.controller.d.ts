import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getDashboardStats(): Promise<{
        newsCount: number;
        userCount: number;
        latestNews: import("./entities/news.entity").News[];
        topAuthors: any[];
    }>;
}
