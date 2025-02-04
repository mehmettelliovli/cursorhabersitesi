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
let AuthService = class AuthService {
    constructor(userRepository, userRoleMappingRepository, jwtService) {
        this.userRepository = userRepository;
        this.userRoleMappingRepository = userRoleMappingRepository;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                relations: ['userRoleMappings'],
            });
            if (!user) {
                console.log('User not found:', email);
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Password validation result:', isPasswordValid);
            if (isPasswordValid) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        }
        catch (error) {
            console.error('Error in validateUser:', error);
            return null;
        }
    }
    async login(loginData) {
        try {
            console.log('Login attempt for:', loginData.email);
            const user = await this.userRepository.findOne({
                where: { email: loginData.email },
                relations: ['userRoleMappings'],
            });
            if (!user) {
                console.log('User not found');
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
            console.log('Password validation result:', isPasswordValid);
            if (!isPasswordValid) {
                console.log('Invalid password');
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const roles = user.userRoleMappings
                ?.filter(mapping => mapping.isActive)
                .map(mapping => mapping.role) || [];
            console.log('User roles:', roles);
            const payload = {
                email: user.email,
                sub: user.id,
                roles: roles
            };
            const token = this.jwtService.sign(payload);
            console.log('JWT token generated successfully');
            const { password, ...userData } = user;
            return {
                access_token: token,
                user: {
                    ...userData,
                    roles: roles
                }
            };
        }
        catch (error) {
            console.error('Login error:', error);
            throw new common_1.UnauthorizedException('Login failed');
        }
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
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map