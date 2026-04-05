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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'integer' }),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_no', type: 'varchar', length: 32, unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_id', type: 'bigint' }),
    __metadata("design:type", String)
], Order.prototype, "buyerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'merchant_id', type: 'bigint' }),
    __metadata("design:type", String)
], Order.prototype, "merchantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'bigint' }),
    __metadata("design:type", String)
], Order.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Order.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency', type: 'varchar', length: 10, default: 'CNY' }),
    __metadata("design:type", String)
], Order.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'pending_deposit',
    }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deposit_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "depositAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deposit_paid_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "depositPaidAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_paid_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "balancePaidAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_method', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "shippingMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tracking_number', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "trackingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'carrier', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "carrier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_cost', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "shippingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'pending_deposit',
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Order.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Order.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders'),
    (0, typeorm_1.Index)('idx_buyer', ['buyerId']),
    (0, typeorm_1.Index)('idx_merchant', ['merchantId']),
    (0, typeorm_1.Index)('idx_status', ['status']),
    (0, typeorm_1.Index)('idx_order_no', ['orderNo'])
], Order);
//# sourceMappingURL=order.entity.js.map