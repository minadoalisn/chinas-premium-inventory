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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Demand = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const category_entity_1 = require("../../categories/entities/category.entity");
let Demand = class Demand {
};
exports.Demand = Demand;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'integer' }),
    __metadata("design:type", String)
], Demand.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_id', type: 'bigint' }),
    __metadata("design:type", String)
], Demand.prototype, "buyerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'buyer_id' }),
    __metadata("design:type", user_entity_1.User)
], Demand.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'int' }),
    __metadata("design:type", Number)
], Demand.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], Demand.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Demand.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_qty', type: 'int' }),
    __metadata("design:type", Number)
], Demand.prototype, "minQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Demand.prototype, "maxPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'demand_desc', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Demand.prototype, "demandDesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Demand.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'open',
    }),
    __metadata("design:type", String)
], Demand.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'matched_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Demand.prototype, "matchedCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Demand.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Demand.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Demand.prototype, "updatedAt", void 0);
exports.Demand = Demand = __decorate([
    (0, typeorm_1.Entity)('demands'),
    (0, typeorm_1.Index)('idx_category', ['categoryId']),
    (0, typeorm_1.Index)('idx_status', ['status']),
    (0, typeorm_1.Index)('idx_buyer', ['buyerId'])
], Demand);
//# sourceMappingURL=demand.entity.js.map