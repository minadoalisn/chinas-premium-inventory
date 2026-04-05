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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const demand_entity_1 = require("./entities/demand.entity");
let DemandsService = class DemandsService {
    constructor(demandsRepository) {
        this.demandsRepository = demandsRepository;
    }
    async create(userId, createData) {
        const demand = this.demandsRepository.create({
            ...createData,
            buyerId: userId,
            status: 'open',
            matchedCount: 0,
        });
        return this.demandsRepository.save(demand);
    }
    async findAll(params) {
        const { page = 1, limit = 20, userId } = params;
        const queryBuilder = this.demandsRepository.createQueryBuilder('demand');
        if (userId) {
            queryBuilder.andWhere('demand.buyerId = :userId', { userId });
        }
        queryBuilder.skip((page - 1) * limit).take(limit);
        queryBuilder.orderBy('demand.createdAt', 'DESC');
        const [items, total] = await queryBuilder.getManyAndCount();
        return {
            success: true,
            data: items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const demand = await this.demandsRepository.findOne({ where: { id } });
        if (!demand) {
            throw new common_1.NotFoundException('求购不存在');
        }
        return demand;
    }
    async update(id, userId, updateData) {
        const demand = await this.findOne(id);
        if (demand.buyerId !== userId) {
            throw new common_1.ForbiddenException('只能修改自己的求购');
        }
        await this.demandsRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id, userId) {
        const demand = await this.findOne(id);
        if (demand.buyerId !== userId) {
            throw new common_1.ForbiddenException('只能删除自己的求购');
        }
        await this.demandsRepository.delete(id);
    }
    async getMyDemands(userId) {
        return this.findAll({ userId });
    }
};
exports.DemandsService = DemandsService;
exports.DemandsService = DemandsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(demand_entity_1.Demand)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], DemandsService);
//# sourceMappingURL=demands.service.js.map