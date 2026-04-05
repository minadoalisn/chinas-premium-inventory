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
exports.MerchantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const merchant_entity_1 = require("./entities/merchant.entity");
let MerchantsService = class MerchantsService {
    constructor(merchantRepository) {
        this.merchantRepository = merchantRepository;
    }
    async findAll(params) {
        const { status, page = 1, limit = 20 } = params || {};
        const where = {};
        if (status) {
            where.status = status;
        }
        const [merchants, total] = await this.merchantRepository.findAndCount({
            where,
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            success: true,
            data: merchants.map((m) => this.formatMerchant(m)),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const merchant = await this.merchantRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        return {
            success: true,
            data: this.formatMerchant(merchant, true),
        };
    }
    async findByUserId(userId) {
        const merchant = await this.merchantRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
        return merchant ? this.formatMerchant(merchant, true) : null;
    }
    async create(data) {
        const merchant = this.merchantRepository.create(data);
        return await this.merchantRepository.save(merchant);
    }
    async update(id, updateData) {
        await this.merchantRepository.update({ id }, updateData);
        return this.findOne(id);
    }
    async getProducts(id, page = 1, limit = 20) {
        return {
            success: true,
            data: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
        };
    }
    formatMerchant(merchant, detailed = false) {
        const base = {
            id: merchant.id,
            companyName: merchant.companyName,
            contactPerson: merchant.contactPerson,
            phone: merchant.phone,
            city: merchant.city,
            province: merchant.province,
            country: merchant.country,
            status: merchant.status,
            rating: merchant.rating,
            completedOrders: merchant.completedOrders,
            responseRate: merchant.responseRate,
            responseTime: merchant.responseTime,
        };
        if (detailed) {
            return {
                ...base,
                address: merchant.address,
                businessLicense: merchant.businessLicense,
                certifications: merchant.certifications,
                factoryArea: merchant.factoryArea,
                employeeCount: merchant.employeeCount,
                established: merchant.approvedAt,
                createdAt: merchant.createdAt,
            };
        }
        return base;
    }
};
exports.MerchantsService = MerchantsService;
exports.MerchantsService = MerchantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(merchant_entity_1.Merchant)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], MerchantsService);
//# sourceMappingURL=merchants.service.js.map