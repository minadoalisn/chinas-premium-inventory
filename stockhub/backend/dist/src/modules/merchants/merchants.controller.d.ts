import { MerchantsService } from './merchants.service';
export declare class MerchantsController {
    private readonly merchantsService;
    constructor(merchantsService: MerchantsService);
    findAll(query: any): Promise<{
        success: boolean;
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            companyName: string;
            contactPerson: string;
            phone: string;
            city: string;
            province: string;
            country: string;
            status: string;
            rating: number;
            completedOrders: number;
            responseRate: number;
            responseTime: string;
        } | {
            address: string;
            businessLicense: string;
            certifications: string[];
            factoryArea: number;
            employeeCount: number;
            established: Date;
            createdAt: Date;
            id: string;
            companyName: string;
            contactPerson: string;
            phone: string;
            city: string;
            province: string;
            country: string;
            status: string;
            rating: number;
            completedOrders: number;
            responseRate: number;
            responseTime: string;
        };
    }>;
    getProducts(id: string, query: any): Promise<{
        success: boolean;
        data: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    create(req: any, data: any): Promise<any>;
    update(id: string, updateData: any): Promise<{
        success: boolean;
        data: {
            id: string;
            companyName: string;
            contactPerson: string;
            phone: string;
            city: string;
            province: string;
            country: string;
            status: string;
            rating: number;
            completedOrders: number;
            responseRate: number;
            responseTime: string;
        } | {
            address: string;
            businessLicense: string;
            certifications: string[];
            factoryArea: number;
            employeeCount: number;
            established: Date;
            createdAt: Date;
            id: string;
            companyName: string;
            contactPerson: string;
            phone: string;
            city: string;
            province: string;
            country: string;
            status: string;
            rating: number;
            completedOrders: number;
            responseRate: number;
            responseTime: string;
        };
    }>;
}
