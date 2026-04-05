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
var TranslateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateService = void 0;
const common_1 = require("@nestjs/common");
let TranslateService = TranslateService_1 = class TranslateService {
    constructor() {
        this.logger = new common_1.Logger(TranslateService_1.name);
    }
    async translateText(text, targetLang = 'en', sourceLang = 'zh') {
        if (!text || text.trim().length === 0) {
            return '';
        }
        try {
            this.logger.debug(`模拟翻译: ${text} → ${targetLang}`);
            return `[${targetLang.toUpperCase()}] ${text}`;
        }
        catch (error) {
            this.logger.error('翻译失败:', error);
            return text;
        }
    }
    async translateBatch(texts, targetLang = 'en', sourceLang = 'zh') {
        return Promise.all(texts.map(text => this.translateText(text, targetLang, sourceLang)));
    }
};
exports.TranslateService = TranslateService;
exports.TranslateService = TranslateService = TranslateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TranslateService);
//# sourceMappingURL=translate.service.js.map