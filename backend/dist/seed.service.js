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
        const categories = await this.createCategories();
        const users = await this.createUsers();
        await this.createNews(users, categories);
        console.log('Seed tamamlandı!');
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
                email: 'yazar1@example.com',
                password: 'password123',
                fullName: 'Ahmet Yazar',
                role: role_enum_1.UserRole.AUTHOR
            },
            {
                email: 'yazar2@example.com',
                password: 'password123',
                fullName: 'Ayşe Editör',
                role: role_enum_1.UserRole.EDITOR
            },
            {
                email: 'yazar3@example.com',
                password: 'password123',
                fullName: 'Mehmet Muhabir',
                role: role_enum_1.UserRole.AUTHOR
            }
        ];
        const savedUsers = [];
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
                savedUsers.push(user);
            }
            else {
                savedUsers.push(existingUser);
            }
        }
        return savedUsers;
    }
    async createNews(users, categories) {
        const news = [
            {
                title: 'Yapay Zeka Teknolojisinde Çığır Açan Gelişme',
                content: 'Bilim insanları, insan beyninin çalışma prensiplerini taklit eden yeni bir yapay zeka modeli geliştirdi. Bu gelişme, yapay zekanın geleceği için önemli bir adım olarak görülüyor.',
                author: users[0],
                category: categories[0],
                imageUrl: 'https://picsum.photos/800/400?random=1'
            },
            {
                title: 'Süper Lig\'de Şampiyonluk Yarışı Kızışıyor',
                content: 'Ligin son haftalarına girilirken şampiyonluk yarışı büyük heyecana sahne oluyor. Takımlar arasındaki puan farkı giderek kapanıyor.',
                author: users[1],
                category: categories[1],
                imageUrl: 'https://picsum.photos/800/400?random=2'
            },
            {
                title: 'Ekonomide Yeni Dönem Başlıyor',
                content: 'Merkez Bankası\'nın aldığı son kararlar sonrasında ekonomide yeni bir dönemin kapıları aralanıyor. Uzmanlar gelişmeleri değerlendirdi.',
                author: users[2],
                category: categories[2],
                imageUrl: 'https://picsum.photos/800/400?random=3'
            },
            {
                title: 'Sağlıklı Yaşam İçin Önemli İpuçları',
                content: 'Uzmanlar, günlük hayatta uygulayabileceğimiz basit ama etkili sağlık önerilerini paylaştı. İşte sağlıklı bir yaşam için altın değerinde tavsiyeler.',
                author: users[0],
                category: categories[3],
                imageUrl: 'https://picsum.photos/800/400?random=4'
            }
        ];
        for (const newsItem of news) {
            const existingNews = await this.newsRepository.findOne({
                where: { title: newsItem.title }
            });
            if (!existingNews) {
                await this.newsRepository.save({
                    ...newsItem,
                    isActive: true
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