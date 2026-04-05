import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        totalUsers: number;
        totalDemands: number;
        totalProducts: number;
        totalOrders: number;
    }>;
}
