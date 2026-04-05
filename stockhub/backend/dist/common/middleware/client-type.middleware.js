"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ClientTypeMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTypeMiddleware = void 0;
const common_1 = require("@nestjs/common");
let ClientTypeMiddleware = ClientTypeMiddleware_1 = class ClientTypeMiddleware {
    constructor() {
        this.logger = new common_1.Logger(ClientTypeMiddleware_1.name);
    }
    use(req, res, next) {
        const clientTypeHeader = req.headers['x-client-type'];
        if (clientTypeHeader && ['domestic', 'overseas'].includes(clientTypeHeader)) {
            req.clientType = clientTypeHeader;
            req.clientIP = req.headers['x-forwarded-for'] || req.ip;
            req.clientCountry = req.headers['x-client-country'] || 'Unknown';
            this.logger.debug(`Request from ${req.clientType} - IP: ${req.clientIP}, Country: ${req.clientCountry}`);
            next();
            return;
        }
        const referer = req.headers.referer || '';
        if (referer.includes('stockhub.cn')) {
            req.clientType = 'domestic';
        }
        else if (referer.includes('stockhub.com')) {
            req.clientType = 'overseas';
        }
        else {
            req.clientType = 'domestic';
        }
        req.clientIP = req.ip;
        req.clientCountry = 'Unknown';
        this.logger.debug(`Inferred client type: ${req.clientType} from referer: ${referer}`);
        next();
    }
};
exports.ClientTypeMiddleware = ClientTypeMiddleware;
exports.ClientTypeMiddleware = ClientTypeMiddleware = ClientTypeMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], ClientTypeMiddleware);
//# sourceMappingURL=client-type.middleware.js.map