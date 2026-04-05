"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingService = exports.logisticsService = exports.LogisticsTrackingService = exports.LogisticsComparisonService = exports.LogisticsService = exports.LOGISTICS_PROVIDERS = void 0;
const axios_1 = __importDefault(require("axios"));
exports.LOGISTICS_PROVIDERS = {
    SF: {
        name: '顺丰速运',
        code: 'SF',
        apiUrl: 'https://bsp.sf-express.com',
        apiKey: '',
        testUrl: 'https://bsptest.sf-express.com',
    },
    DHL: {
        name: 'DHL国际快递',
        code: 'DHL',
        apiUrl: 'https://api.dhl.com',
        apiKey: '',
    },
    FedEx: {
        name: 'FedEx联邦快递',
        code: 'FedEx',
        apiUrl: 'https://api.fedex.com',
        apiKey: '',
    },
    UPS: {
        name: 'UPS联合包裹',
        code: 'UPS',
        apiUrl: 'https://api.ups.com',
        apiKey: '',
    },
};
class LogisticsService {
    constructor(provider, isTest = true) {
        const config = exports.LOGISTICS_PROVIDERS[provider];
        this.apiKey = config.apiKey;
        this.apiUrl = isTest && 'testUrl' in config && config.testUrl ? config.testUrl : config.apiUrl;
    }
    async calculateFreight(params) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/freight/calculate`, {
                apiKey: this.apiKey,
                ...params,
            });
            return response.data;
        }
        catch (error) {
            console.error('计算运费失败:', error);
            throw error;
        }
    }
    async track(trackingNumber) {
        try {
            const response = await axios_1.default.get(`${this.apiUrl}/track/${trackingNumber}`, {
                params: { apiKey: this.apiKey },
            });
            return response.data;
        }
        catch (error) {
            console.error('查询物流轨迹失败:', error);
            throw error;
        }
    }
    async estimateArrival(params) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/arrival/estimate`, {
                apiKey: this.apiKey,
                ...params,
            });
            return response.data;
        }
        catch (error) {
            console.error('预计到达时间查询失败:', error);
            throw error;
        }
    }
    async getServiceTypes() {
        try {
            const response = await axios_1.default.get(`${this.apiUrl}/services`, {
                params: { apiKey: this.apiKey },
            });
            return response.data;
        }
        catch (error) {
            console.error('获取服务类型失败:', error);
            throw error;
        }
    }
    async generateWaybill(params) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/waybill/generate`, {
                apiKey: this.apiKey,
                ...params,
            });
            return response.data;
        }
        catch (error) {
            console.error('生成电子面单失败:', error);
            throw error;
        }
    }
}
exports.LogisticsService = LogisticsService;
class LogisticsComparisonService {
    async compareFreight(params) {
        const results = [];
        const providers = params.providers || ['SF', 'DHL', 'FedEx', 'UPS'];
        for (const providerCode of providers) {
            try {
                const service = new LogisticsService(providerCode);
                const freight = await service.calculateFreight(params);
                results.push({
                    provider: exports.LOGISTICS_PROVIDERS[providerCode].name,
                    code: providerCode,
                    price: freight.price,
                    estimatedDays: freight.estimatedDays,
                    serviceType: freight.serviceType,
                });
            }
            catch (error) {
                console.error(`获取${providerCode}运费失败:`, error);
            }
        }
        return results.sort((a, b) => a.price - b.price);
    }
    async recommendBest(params) {
        const comparison = await this.compareFreight(params);
        if (params.urgent) {
            return comparison.sort((a, b) => a.estimatedDays - b.estimatedDays)[0];
        }
        else if (params.budget) {
            const withinBudget = comparison.filter(r => r.price <= params.budget);
            if (withinBudget.length > 0) {
                return withinBudget[0];
            }
        }
        return comparison.sort((a, b) => {
            const scoreA = a.price / a.estimatedDays;
            const scoreB = b.price / b.estimatedDays;
            return scoreA - scoreB;
        })[0];
    }
}
exports.LogisticsComparisonService = LogisticsComparisonService;
class LogisticsTrackingService {
    async batchTrack(trackingNumbers) {
        const results = [];
        for (const item of trackingNumbers) {
            try {
                const service = new LogisticsService(item.provider);
                const tracking = await service.track(item.number);
                results.push({
                    number: item.number,
                    provider: item.provider,
                    status: tracking.status,
                    lastUpdate: tracking.lastUpdate,
                    estimatedDelivery: tracking.estimatedDelivery,
                    trackingDetails: tracking.trackingDetails,
                });
            }
            catch (error) {
                console.error(`追踪${item.number}失败:`, error);
                results.push({
                    number: item.number,
                    provider: item.provider,
                    error: '追踪失败',
                });
            }
        }
        return results;
    }
    async subscribeTracking(trackingNumber, provider, callback) {
        console.log(`订阅物流状态: ${trackingNumber} (${provider})`);
    }
}
exports.LogisticsTrackingService = LogisticsTrackingService;
exports.logisticsService = new LogisticsComparisonService();
exports.trackingService = new LogisticsTrackingService();
//# sourceMappingURL=logistics.service.js.map