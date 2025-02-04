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
exports.NewsController = void 0;
const common_1 = require("@nestjs/common");
const news_service_1 = require("./news.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const role_enum_1 = require("../entities/role.enum");
let NewsController = class NewsController {
    constructor(newsService) {
        this.newsService = newsService;
    }
    async findAll(req) {
        if (req.user.role === role_enum_1.UserRole.AUTHOR) {
            return this.newsService.findByAuthor(req.user.id);
        }
        return this.newsService.findAll();
    }
    async findLatest(limit) {
        return this.newsService.findLatest(limit);
    }
    async findMostViewed(limit) {
        return this.newsService.findMostViewed(limit);
    }
    async findByCategory(id) {
        return this.newsService.findByCategory(+id);
    }
    async findOne(id, req) {
        const news = await this.newsService.findOne(+id);
        if (req.user.role === role_enum_1.UserRole.AUTHOR && news.author.id !== req.user.id) {
            throw new common_1.UnauthorizedException('You can only view your own news');
        }
        await this.newsService.incrementViewCount(+id);
        return news;
    }
    async create(createNewsDto, req) {
        return this.newsService.create(createNewsDto, req.user);
    }
    async update(id, updateNewsDto, req) {
        const news = await this.newsService.findOne(+id);
        if (req.user.role === role_enum_1.UserRole.AUTHOR && news.author.id !== req.user.id) {
            throw new common_1.UnauthorizedException('You can only update your own news');
        }
        return this.newsService.update(+id, updateNewsDto);
    }
    async remove(id, req) {
        const news = await this.newsService.findOne(+id);
        if (req.user.role === role_enum_1.UserRole.AUTHOR && news.author.id !== req.user.id) {
            throw new common_1.UnauthorizedException('You can only delete your own news');
        }
        return this.newsService.delete(+id);
    }
};
exports.NewsController = NewsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('latest'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "findLatest", null);
__decorate([
    (0, common_1.Get)('most-viewed'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "findMostViewed", null);
__decorate([
    (0, common_1.Get)('category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.SUPER_ADMIN, role_enum_1.UserRole.ADMIN, role_enum_1.UserRole.AUTHOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "remove", null);
exports.NewsController = NewsController = __decorate([
    (0, common_1.Controller)('news'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [news_service_1.NewsService])
], NewsController);
//# sourceMappingURL=news.controller.js.map