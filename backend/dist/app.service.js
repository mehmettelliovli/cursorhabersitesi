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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const news_entity_1 = require("./entities/news.entity");
const user_entity_1 = require("./entities/user.entity");
let AppService = class AppService {
    constructor(newsRepository, userRepository) {
        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
    }
    getHello() {
        return 'Hello World!';
    }
    async getDashboardStats() {
        const [newsCount, userCount, latestNews, topAuthors] = await Promise.all([
            this.newsRepository.count(),
            this.userRepository.count(),
            this.newsRepository.find({
                relations: ['author'],
                order: { createdAt: 'DESC' },
                take: 5,
            }),
            this.userRepository
                .createQueryBuilder('user')
                .leftJoin('user.news', 'news')
                .select(['user.id', 'user.email', 'user.fullName', 'user.bio', 'user.profileImage', 'user.isActive'])
                .addSelect('COUNT(news.id)', 'newsCount')
                .groupBy('user.id')
                .orderBy('newsCount', 'DESC')
                .limit(5)
                .getRawMany(),
        ]);
        return {
            newsCount,
            userCount,
            latestNews,
            topAuthors,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_entity_1.News)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AppService);
//# sourceMappingURL=app.service.js.map