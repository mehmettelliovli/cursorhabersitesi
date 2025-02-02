import { SeedService } from './seed.service';
export declare class AppModule {
    private readonly seedService;
    constructor(seedService: SeedService);
    onModuleInit(): Promise<void>;
}
