import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getDashboard(): Promise<{
        totalUsers: number;
        totalDemands: number;
        totalProducts: number;
        totalOrders: number;
    }>;
}
