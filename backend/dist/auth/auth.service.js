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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_role_mapping_entity_1 = require("../entities/user-role-mapping.entity");
const role_enum_1 = require("../entities/role.enum");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(userRepository, userRoleMappingRepository, jwtService, usersService) {
        this.userRepository = userRepository;
        this.userRoleMappingRepository = userRoleMappingRepository;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async onModuleInit() {
        await this.ensureSuperAdmin();
    }
    async ensureSuperAdmin() {
        const email = 'mehmet_developer@hotmail.com';
        const password = 'mehmet61';
        const fullName = 'Super Admin';
        try {
            let superAdmin = await this.usersService.findByEmail(email);
            if (!superAdmin) {
                const hashedPassword = await bcrypt.hash(password, 10);
                superAdmin = await this.usersService.create({
                    email,
                    password: hashedPassword,
                    fullName,
                });
                await this.usersService.addRole(superAdmin.id, role_enum_1.UserRole.SUPER_ADMIN);
                console.log('Süper admin kullanıcısı başarıyla oluşturuldu.');
            }
        }
        catch (error) {
            console.error('Süper admin oluşturulurken hata:', error);
        }
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            roles: user.roleMappings?.map(rm => rm.role) || [],
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(userData) {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email }
        });
        if (existingUser) {
            throw new common_1.UnauthorizedException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = this.userRepository.create({
            ...userData,
            password: hashedPassword,
            isActive: true,
        });
        const savedUser = await this.userRepository.save(newUser);
        const roleMapping = this.userRoleMappingRepository.create({
            user: savedUser,
            role: role_enum_1.UserRole.USER,
            isActive: true
        });
        await this.userRoleMappingRepository.save(roleMapping);
        const { password, ...resultObject } = savedUser;
        return resultObject;
    }
    async validateToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_role_mapping_entity_1.UserRoleMapping)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map