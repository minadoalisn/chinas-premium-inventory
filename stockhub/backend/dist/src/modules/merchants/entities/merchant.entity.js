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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merchant = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Merchant = class Merchant {
};
exports.Merchant = Merchant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'integer' }),
    __metadata("design:type", String)
], Merchant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", String)
], Merchant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Merchant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Merchant.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'business_license', type: 'varchar', length: 50, unique: true, }),
    __metadata("design:type", String)
], Merchant.prototype, "businessLicense", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Merchant.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Merchant.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Merchant.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Merchant.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Merchant.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: 'China' }),
    __metadata("design:type", String)
], Merchant.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postal_code', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Merchant.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'factory_area', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Merchant.prototype, "factoryArea", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_count', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Merchant.prototype, "employeeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'production_lines', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Merchant.prototype, "productionLines", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'annual_revenue', type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Merchant.prototype, "annualRevenue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Merchant.prototype, "certifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_images', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Merchant.prototype, "productImages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'pending' }),
    __metadata("design:type", String)
], Merchant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 2, scale: 1, default: 5.0 }),
    __metadata("design:type", Number)
], Merchant.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_orders', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Merchant.prototype, "completedOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_reviews', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Merchant.prototype, "totalReviews", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_rate', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Merchant.prototype, "responseRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_time', type: 'varchar', length: 20, default: '24h' }),
    __metadata("design:type", String)
], Merchant.prototype, "responseTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Merchant.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_account', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Merchant.prototype, "bankAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'swift_code', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Merchant.prototype, "swiftCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Merchant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Merchant.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Merchant.prototype, "approvedAt", void 0);
exports.Merchant = Merchant = __decorate([
    (0, typeorm_1.Entity)('merchants'),
    (0, typeorm_1.Index)('idx_status', ['status'])
], Merchant);
//# sourceMappingURL=merchant.entity.js.map