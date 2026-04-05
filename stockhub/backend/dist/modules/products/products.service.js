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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async create(userId, merchantId, createData) {
        const product = this.productsRepository.create({
            ...createData,
            merchantId,
            status: 'pending',
        });
        return this.productsRepository.save(product);
    }
    async findAll(params) {
        const { page = 1, limit = 20, search, minPrice, maxPrice, sort = 'newest', clientType = 'domestic', merchantId, } = params;
        const queryBuilder = this.productsRepository.createQueryBuilder('product');
        if (clientType === 'overseas') {
            queryBuilder.andWhere('product.status = :status', { status: 'approved' });
            queryBuilder.andWhere('product.displayOverseas = :displayOverseas', { displayOverseas: true });
        }
        else {
            if (merchantId) {
                queryBuilder.andWhere('product.merchantId = :merchantId', { merchantId });
            }
            else {
                queryBuilder.andWhere('product.status IN (:...statuses)', { statuses: ['pending', 'approved', 'rejected'] });
            }
        }
        if (search) {
            queryBuilder.andWhere('(product.title LIKE :search OR product.description LIKE :search)', { search: `%${search}%` });
        }
        if (minPrice) {
            queryBuilder.andWhere('product.priceDomestic >= :minPrice', { minPrice });
        }
        if (maxPrice) {
            queryBuilder.andWhere('product.priceDomestic <= :maxPrice', { maxPrice });
        }
        switch (sort) {
            case 'price_asc':
                queryBuilder.orderBy('product.priceDomestic', 'ASC');
                break;
            case 'price_desc':
                queryBuilder.orderBy('product.priceDomestic', 'DESC');
                break;
            case 'newest':
            default:
                queryBuilder.orderBy('product.createdAt', 'DESC');
                break;
        }
        const total = await queryBuilder.getCount();
        queryBuilder.skip((page - 1) * limit).take(limit);
        const data = await queryBuilder.getMany();
        return {
            success: true,
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('商品不存在');
        }
        return product;
    }
    async update(id, userId, updateData) {
        const product = await this.findOne(id);
        if (updateData.stockQty !== undefined && Number(updateData.stockQty) <= 0) {
            updateData.displayOverseas = false;
        }
        else if (updateData.stockQty !== undefined && Number(updateData.stockQty) > 0 && product.status === 'approved') {
            updateData.displayOverseas = true;
        }
        await this.productsRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id, userId) {
        const product = await this.findOne(id);
        await this.productsRepository.delete(id);
    }
    async approve(id) {
        const product = await this.findOne(id);
        product.status = 'approved';
        product.approvedAt = new Date();
        if (product.stockQty > 0) {
            product.displayOverseas = true;
        }
        return this.productsRepository.save(product);
    }
    async reject(id) {
        const product = await this.findOne(id);
        product.status = 'rejected';
        product.displayOverseas = false;
        return this.productsRepository.save(product);
    }
    async getSimilar(id, limit = 5) {
        const product = await this.findOne(id);
        return this.productsRepository.find({
            where: {
                categoryId: product.categoryId,
                status: 'approved',
                id: { $ne: id },
            },
            order: { stockQty: 'DESC' },
            take: limit,
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map