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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const news_entity_1 = require("../entities/news.entity");
let NewsService = class NewsService {
    constructor(newsRepository) {
        this.newsRepository = newsRepository;
    }
    async findAll() {
        return this.newsRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const news = await this.newsRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!news) {
            throw new common_1.NotFoundException(`News with ID ${id} not found`);
        }
        return news;
    }
    async create(newsData, author) {
        const newNews = this.newsRepository.create({
            ...newsData,
            author,
        });
        const savedNews = await this.newsRepository.save(newNews);
        return Array.isArray(savedNews) ? savedNews[0] : savedNews;
    }
    async update(id, newsData) {
        await this.newsRepository.update(id, newsData);
        return this.findOne(id);
    }
    async delete(id) {
        const result = await this.newsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`News with ID ${id} not found`);
        }
    }
    async findMostViewed() {
        return this.newsRepository.find({
            relations: ['author'],
            order: { viewCount: 'DESC' },
            take: 10,
        });
    }
    async findByCategory(category) {
        return this.newsRepository.find({
            where: { category },
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
    }
    async incrementViewCount(id) {
        await this.newsRepository.increment({ id }, 'viewCount', 1);
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_entity_1.News)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NewsService);
//# sourceMappingURL=news.service.js.map