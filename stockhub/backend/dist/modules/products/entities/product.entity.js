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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../categories/entities/category.entity");
const merchant_entity_1 = require("../../merchants/entities/merchant.entity");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'integer' }),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'merchant_id', type: 'bigint' }),
    __metadata("design:type", String)
], Product.prototype, "merchantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_entity_1.Merchant, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'merchant_id' }),
    __metadata("design:type", merchant_entity_1.Merchant)
], Product.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'int' }),
    __metadata("design:type", Number)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title_en', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "titleEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description_en', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "descriptionEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], Product.prototype, "specifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "videos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_qty', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stockQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'domestic_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "domesticPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'overseas_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "overseasPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_order_qty', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Product.prototype, "minOrderQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'wholesale_tiers', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "wholesaleTiers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_domestic', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "displayDomestic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_overseas', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "displayOverseas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_expired', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isExpired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expire_date', type: 'date', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Product.prototype, "expireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'pending',
    }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seo_title', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "seoTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seo_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "seoDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seo_keywords', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "seoKeywords", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inquiry_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "inquiryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sold_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "soldCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'synced_at', type: 'datetime', nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Product.prototype, "syncedAt", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products'),
    (0, typeorm_1.Index)('idx_category', ['categoryId']),
    (0, typeorm_1.Index)('idx_merchant', ['merchantId']),
    (0, typeorm_1.Index)('idx_status', ['status']),
    (0, typeorm_1.Index)('idx_display_domestic', ['displayDomestic', 'status']),
    (0, typeorm_1.Index)('idx_display_overseas', ['displayOverseas', 'status'])
], Product);
//# sourceMappingURL=product.entity.js.map