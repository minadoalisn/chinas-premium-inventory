import { DemandsService } from './demands.service';
export declare class DemandsController {
    private readonly demandsService;
    constructor(demandsService: DemandsService);
    create(req: any, createDemandDto: any): Promise<import("./entities/demand.entity").Demand>;
    findAll(req: any, page?: string, limit?: string, userId?: string): Promise<{
        success: boolean;
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getMyDemands(req: any): Promise<{
        success: boolean;
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/demand.entity").Demand>;
    getMatch(id: string): any;
    update(req: any, id: string, updateDemandDto: any): Promise<import("./entities/demand.entity").Demand>;
    delete(req: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
