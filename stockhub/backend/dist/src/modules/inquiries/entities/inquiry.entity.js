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
exports.Inquiry = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Inquiry = class Inquiry {
};
exports.Inquiry = Inquiry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'integer' }),
    __metadata("design:type", String)
], Inquiry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_id', type: 'bigint' }),
    __metadata("design:type", String)
], Inquiry.prototype, "buyerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'buyer_id' }),
    __metadata("design:type", user_entity_1.User)
], Inquiry.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_company_name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Inquiry.prototype, "buyerCompanyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Inquiry.prototype, "buyerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_email', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Inquiry.prototype, "buyerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_phone', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Inquiry.prototype, "buyerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_ids', type: 'json' }),
    __metadata("design:type", Array)
], Inquiry.prototype, "productIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_details', type: 'json', nullable: true }),
    __metadata("design:type", String)
], Inquiry.prototype, "productDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Inquiry.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'pending',
    }),
    __metadata("design:type", String)
], Inquiry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_viewed_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Inquiry.prototype, "buyerViewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'merchant_reply', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Inquiry.prototype, "merchantReply", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'merchant_viewed_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Inquiry.prototype, "merchantViewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_activity_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Inquiry.prototype, "lastActivityAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Inquiry.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Inquiry.prototype, "updatedAt", void 0);
exports.Inquiry = Inquiry = __decorate([
    (0, typeorm_1.Entity)('inquiries'),
    (0, typeorm_1.Index)('idx_buyer', ['buyerId']),
    (0, typeorm_1.Index)('idx_status', ['status'])
], Inquiry);
//# sourceMappingURL=inquiry.entity.js.map