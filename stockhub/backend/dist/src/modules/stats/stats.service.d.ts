export declare class StatsService {
    constructor();
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalDemands: number;
        totalProducts: number;
        totalOrders: number;
    }>;
}
