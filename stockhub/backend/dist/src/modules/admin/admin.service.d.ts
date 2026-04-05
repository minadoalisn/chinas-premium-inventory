export declare class AdminService {
    constructor();
    getDashboard(): Promise<{
        totalUsers: number;
        totalDemands: number;
        totalProducts: number;
        totalOrders: number;
    }>;
}
