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
exports.DemandsController = void 0;
const common_1 = require("@nestjs/common");
const demands_service_1 = require("./demands.service");
let DemandsController = class DemandsController {
    constructor(demandsService) {
        this.demandsService = demandsService;
    }
    create(req, createDemandDto) {
        const userId = req.user?.buyerId || req.user?.userId || req.user?.sub || '1';
        return this.demandsService.create(userId, createDemandDto);
    }
    findAll(req, page, limit, userId) {
        return this.demandsService.findAll({
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            userId: userId || req.user?.buyerId || req.user?.userId || null,
        });
    }
    getMyDemands(req) {
        const userId = req.user?.buyerId || req.user?.userId || '1';
        return this.demandsService.getMyDemands(userId);
    }
    findOne(id) {
        return this.demandsService.findOne(id);
    }
    getMatch(id) {
        return this.demandsService.getMatch(id);
    }
    update(req, id, updateDemandDto) {
        const userId = req.user?.buyerId || req.user?.userId || '1';
        return this.demandsService.update(id, userId, updateDemandDto);
    }
    async delete(req, id) {
        const userId = req.user?.buyerId || req.user?.userId || '1';
        await this.demandsService.remove(id, userId);
        return { success: true, message: '删除成功' };
    }
};
exports.DemandsController = DemandsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DemandsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], DemandsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DemandsController.prototype, "getMyDemands", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DemandsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/match'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DemandsController.prototype, "getMatch", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], DemandsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DemandsController.prototype, "delete", null);
exports.DemandsController = DemandsController = __decorate([
    (0, common_1.Controller)('demands'),
    __metadata("design:paramtypes", [demands_service_1.DemandsService])
], DemandsController);
//# sourceMappingURL=demands.controller.js.map