"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const news_entity_1 = require("./entities/news.entity");
const category_entity_1 = require("./entities/category.entity");
const user_role_mapping_entity_1 = require("./entities/user-role-mapping.entity");
const role_enum_1 = require("./entities/role.enum");
const bcrypt = require("bcrypt");
let SeedService = class SeedService {
    constructor(userRepository, newsRepository, categoryRepository, userRoleMappingRepository) {
        this.userRepository = userRepository;
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
        this.userRoleMappingRepository = userRoleMappingRepository;
    }
    async seed() {
        await this.createUsers();
        const categories = await this.createCategories();
        const users = await this.userRepository.find();
        await this.createNews(users, categories);
        console.log('Seed completed successfully!');
    }
    async createCategories() {
        const categories = [
            { name: 'Teknoloji', description: 'Teknoloji haberleri' },
            { name: 'Spor', description: 'Spor haberleri' },
            { name: 'Ekonomi', description: 'Ekonomi haberleri' },
            { name: 'Sağlık', description: 'Sağlık haberleri' },
        ];
        const savedCategories = [];
        for (const category of categories) {
            const existingCategory = await this.categoryRepository.findOne({
                where: { name: category.name }
            });
            if (!existingCategory) {
                savedCategories.push(await this.categoryRepository.save(category));
            }
            else {
                savedCategories.push(existingCategory);
            }
        }
        return savedCategories;
    }
    async createUsers() {
        const users = [
            {
                email: 'admin@example.com',
                password: 'admin123',
                fullName: 'Admin User',
                role: role_enum_1.UserRole.SUPER_ADMIN
            },
            {
                email: 'editor@example.com',
                password: 'editor123',
                fullName: 'Editor User',
                role: role_enum_1.UserRole.EDITOR
            },
            {
                email: 'author@example.com',
                password: 'author123',
                fullName: 'Author User',
                role: role_enum_1.UserRole.AUTHOR
            }
        ];
        for (const userData of users) {
            const existingUser = await this.userRepository.findOne({
                where: { email: userData.email }
            });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = await this.userRepository.save({
                    email: userData.email,
                    password: hashedPassword,
                    fullName: userData.fullName,
                    isActive: true
                });
                await this.userRoleMappingRepository.save({
                    user,
                    role: userData.role,
                    isActive: true
                });
                console.log(`Created user: ${userData.email} with role: ${userData.role}`);
            }
        }
    }
    async createNews(users, categories) {
        const newsItems = [
            {
                title: 'Yapay Zeka Teknolojisinde Çığır Açan Gelişme',
                content: 'Bilim insanları, insan beyninin çalışma prensiplerini taklit eden yeni bir yapay zeka modeli geliştirdi...',
                category: categories[0],
                imageUrl: 'https://picsum.photos/800/400?random=1'
            },
            {
                title: 'Süper Lig\'de Şampiyonluk Yarışı',
                content: 'Ligin son haftalarına girilirken şampiyonluk yarışı büyük heyecana sahne oluyor...',
                category: categories[1],
                imageUrl: 'https://picsum.photos/800/400?random=2'
            },
            {
                title: 'Ekonomide Yeni Dönem',
                content: 'Merkez Bankası\'nın aldığı son kararlar sonrasında ekonomide yeni bir dönem başlıyor...',
                category: categories[2],
                imageUrl: 'https://picsum.photos/800/400?random=3'
            }
        ];
        for (const [index, newsItem] of newsItems.entries()) {
            const existingNews = await this.newsRepository.findOne({
                where: { title: newsItem.title }
            });
            if (!existingNews) {
                await this.newsRepository.save({
                    ...newsItem,
                    author: users[index % users.length],
                    isActive: true,
                    viewCount: Math.floor(Math.random() * 1000)
                });
            }
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(news_entity_1.News)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(3, (0, typeorm_1.InjectRepository)(user_role_mapping_entity_1.UserRoleMapping)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map