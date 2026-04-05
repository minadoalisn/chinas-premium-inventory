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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
let CategoriesService = class CategoriesService {
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    async initializeCategories() {
        const count = await this.categoriesRepository.count();
        if (count > 0) {
            console.log('类目数据已存在，跳过初始化');
            return;
        }
        const categories = [
            { id: '1', name: '小家电', color: 'red', icon: 'ri-home-smile-line' },
            { id: '2', name: '电子产品', color: 'blue', icon: 'ri-smartphone-line' },
            { id: '3', name: '快消品', color: 'green', icon: 'ri-shopping-basket-line' },
            { id: '4', name: '旅游用品', color: 'yellow', icon: 'ri-suitcase-line' },
            { id: '5', name: '日用品', color: 'orange', icon: 'ri-home-gear-line' },
            { id: '6', name: '美妆', color: 'purple', icon: 'ri-magic-line' },
            { id: '7', name: '家居用品', color: 'pink', icon: 'ri-home-4-line' },
            { id: '8', name: 'LED灯', color: 'teal', icon: 'ri-lightbulb-line' },
            { id: '9', name: '家具', color: 'indigo', icon: 'ri-armchair-line' },
            { id: '10', name: '设备', color: 'violet', icon: 'ri-tools-line' },
            { id: '11', name: '原材料', color: 'cyan', icon: 'ri-leaf-line' },
            { id: '12', name: '五金建材', color: 'gray', icon: 'ri-hammer-line' },
        ];
        for (const categoryData of categories) {
            const category = this.categoriesRepository.create(categoryData);
            await this.categoriesRepository.save(category);
        }
        console.log(`已初始化 ${categories.length} 个类目`);
    }
    async findAll() {
        return this.categoriesRepository.find({
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        return this.categoriesRepository.findOne({
            where: { id },
        });
    }
    async findByIds(ids) {
        return this.categoriesRepository.find({
            where: ids.map(id => ({ id })),
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map