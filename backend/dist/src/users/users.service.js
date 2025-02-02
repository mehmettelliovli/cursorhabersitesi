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
let UsersService = class UsersService {
    constructor(userRepository, userRoleMappingRepository) {
        this.userRepository = userRepository;
        this.userRoleMappingRepository = userRoleMappingRepository;
    }
    async findAll() {
        return this.userRepository.find({
            relations: ['roleMappings'],
        });
    }
    async findOne(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['roleMappings'],
        });
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
            relations: ['roleMappings'],
        });
    }
    async create(userData) {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
    async update(id, userData) {
        await this.userRepository.update(id, userData);
        return this.findOne(id);
    }
    async delete(id) {
        await this.userRepository.delete(id);
    }
    async addRole(userId, role, grantedBy) {
        const user = await this.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const roleMapping = this.userRoleMappingRepository.create({
            user,
            role,
            isActive: true,
            grantedBy,
        });
        await this.userRoleMappingRepository.save(roleMapping);
    }
    async removeRole(userId, role) {
        const user = await this.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRoleMappingRepository.delete({
            user: { id: userId },
            role,
        });
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