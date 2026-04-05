"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const demands_service_1 = require("./demands.service");
const demands_controller_1 = require("./demands.controller");
const demand_entity_1 = require("./entities/demand.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let DemandsModule = class DemandsModule {
};
exports.DemandsModule = DemandsModule;
exports.DemandsModule = DemandsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([demand_entity_1.Demand, category_entity_1.Category])],
        controllers: [demands_controller_1.DemandsController],
        providers: [demands_service_1.DemandsService],
        exports: [demands_service_1.DemandsService],
    })
], DemandsModule);
//# sourceMappingURL=demands.module.js.map