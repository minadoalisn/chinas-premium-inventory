import { Repository } from 'typeorm';
import { TranslateService } from '../../common/translate/translate.service';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private productsRepository;
    private translateService;
    constructor(productsRepository: Repository<Product>, translateService: TranslateService);
    create(userId: string, merchantId: string, createData: Partial<Product>): Promise<Product>;
    findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: 'newest' | 'price_asc' | 'price_desc';
        clientType?: 'domestic' | 'overseas';
        merchantId?: string;
    }): Promise<{
        success: boolean;
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Product>;
    update(id: string, userId: string, updateData: Partial<Product>): Promise<Product>;
    remove(id: string, userId: string): Promise<void>;
    approve(id: string): Promise<Product>;
    reject(id: string): Promise<Product>;
    getSimilar(id: string, limit?: number): Promise<Product[]>;
}
