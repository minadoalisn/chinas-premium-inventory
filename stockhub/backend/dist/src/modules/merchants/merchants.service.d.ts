import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';
export declare class MerchantsService {
    private readonly merchantRepository;
    constructor(merchantRepository: Repository<Merchant>);
    findAll(params?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
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
    findByUserId(userId: string): Promise<{
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
    }>;
    create(data: Partial<Merchant>): Promise<any>;
    update(id: string, updateData: Partial<Merchant>): Promise<{
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
    getProducts(id: string, page?: number, limit?: number): Promise<{
        success: boolean;
        data: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    private formatMerchant;
}
