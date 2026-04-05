import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';
export declare class MerchantsService {
    private readonly merchantRepository;
    constructor(merchantRepository: Repository<Merchant>);
    findAll(params?: {
        status?: string;
        page?: number;
        limit?: number;
    }): unknown;
    findOne(id: string): unknown;
    findByUserId(userId: string): unknown;
    create(data: Partial<Merchant>): unknown;
    update(id: string, updateData: Partial<Merchant>): unknown;
    getProducts(id: string, page?: number, limit?: number): unknown;
    private formatMerchant;
}
