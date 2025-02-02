"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const user_entity_1 = require("./entities/user.entity");
const user_role_mapping_entity_1 = require("./entities/user-role-mapping.entity");
const news_entity_1 = require("./entities/news.entity");
const category_entity_1 = require("./entities/category.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: 'postgresql://neondb_owner:npg_G6Y0NZFjpTVt@ep-still-tree-a968kvqw-pooler.gwc.azure.neon.tech/neondb?sslmode=require',
                entities: [user_entity_1.User, user_role_mapping_entity_1.UserRoleMapping, news_entity_1.News, category_entity_1.Category],
                synchronize: true,
                ssl: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_role_mapping_entity_1.UserRoleMapping, news_entity_1.News, category_entity_1.Category]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map