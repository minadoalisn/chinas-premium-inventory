export declare const LOGISTICS_PROVIDERS: {
    SF: {
        name: string;
        code: string;
        apiUrl: string;
        apiKey: string;
        testUrl: string;
    };
    DHL: {
        name: string;
        code: string;
        apiUrl: string;
        apiKey: string;
    };
    FedEx: {
        name: string;
        code: string;
        apiUrl: string;
        apiKey: string;
    };
    UPS: {
        name: string;
        code: string;
        apiUrl: string;
        apiKey: string;
    };
};
export declare class LogisticsService {
    private apiKey;
    private apiUrl;
    constructor(provider: keyof typeof LOGISTICS_PROVIDERS, isTest?: boolean);
    calculateFreight(params: {
        from: string;
        to: string;
        weight: number;
        length?: number;
        width?: number;
        height?: number;
        value?: number;
    }): Promise<any>;
    track(trackingNumber: string): Promise<any>;
    estimateArrival(params: {
        from: string;
        to: string;
        serviceType?: string;
    }): Promise<any>;
    getServiceTypes(): Promise<any>;
    generateWaybill(params: {
        sender: {
            name: string;
            phone: string;
            address: string;
            city: string;
            province: string;
            postcode: string;
        };
        receiver: {
            name: string;
            phone: string;
            address: string;
            city: string;
            province: string;
            postcode: string;
        };
        package: {
            weight: number;
            items: Array<{
                name: string;
                quantity: number;
                value?: number;
            }>;
        };
        serviceType?: string;
    }): Promise<any>;
}
export declare class LogisticsComparisonService {
    compareFreight(params: {
        from: string;
        to: string;
        weight: number;
        dimensions?: {
            length: number;
            width: number;
            height: number;
        };
        providers?: string[];
    }): Promise<any[]>;
    recommendBest(params: {
        from: string;
        to: string;
        weight: number;
        budget?: number;
        urgent?: boolean;
    }): Promise<any>;
}
export declare class LogisticsTrackingService {
    batchTrack(trackingNumbers: Array<{
        number: string;
        provider: string;
    }>): Promise<any[]>;
    subscribeTracking(trackingNumber: string, provider: string, callback: (data: any) => void): Promise<void>;
}
export declare const logisticsService: LogisticsComparisonService;
export declare const trackingService: LogisticsTrackingService;
