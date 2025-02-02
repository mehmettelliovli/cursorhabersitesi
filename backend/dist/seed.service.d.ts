import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { News } from './entities/news.entity';
import { Category } from './entities/category.entity';
import { UserRoleMapping } from './entities/user-role-mapping.entity';
export declare class SeedService {
    private readonly userRepository;
    private readonly newsRepository;
    private readonly categoryRepository;
    private readonly userRoleMappingRepository;
    constructor(userRepository: Repository<User>, newsRepository: Repository<News>, categoryRepository: Repository<Category>, userRoleMappingRepository: Repository<UserRoleMapping>);
    seed(): Promise<void>;
    private createCategories;
    private createUsers;
    private createNews;
}
