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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_role_mapping_entity_1 = require("../entities/user-role-mapping.entity");
const role_enum_1 = require("../entities/role.enum");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userRepository, userRoleMappingRepository) {
        this.userRepository = userRepository;
        this.userRoleMappingRepository = userRoleMappingRepository;
    }
    async findAll() {
        return this.userRepository.find({
            relations: ['roleMappings'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['roleMappings'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
            relations: ['roleMappings'],
        });
    }
    async create(userData) {
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        const user = this.userRepository.create({
            ...userData,
            isActive: true,
        });
        const savedUser = await this.userRepository.save(user);
        await this.addRole(savedUser.id, role_enum_1.UserRole.AUTHOR);
        return this.findOne(savedUser.id);
    }
    async update(id, userData) {
        const user = await this.findOne(id);
        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.findByEmail(userData.email);
            if (existingUser) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        else {
            delete userData.password;
        }
        await this.userRepository.update(id, userData);
        return this.findOne(id);
    }
    async delete(id) {
        const user = await this.findOne(id);
        user.isActive = false;
        await this.userRepository.save(user);
    }
    async addRole(userId, role, grantedBy) {
        const user = await this.findOne(userId);
        const existingRole = await this.userRoleMappingRepository.findOne({
            where: {
                user: { id: userId },
                role,
                isActive: true,
            },
        });
        if (!existingRole) {
            const roleMapping = this.userRoleMappingRepository.create({
                user,
                role,
                isActive: true,
                grantedBy,
            });
            await this.userRoleMappingRepository.save(roleMapping);
        }
    }
    async removeRole(userId, role) {
        const roleMapping = await this.userRoleMappingRepository.findOne({
            where: {
                user: { id: userId },
                role,
                isActive: true,
            },
        });
        if (roleMapping) {
            roleMapping.isActive = false;
            await this.userRoleMappingRepository.save(roleMapping);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_role_mapping_entity_1.UserRoleMapping)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map