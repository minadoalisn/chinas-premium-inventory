import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    create(userId: string, merchantId: string, createData: Partial<Product>): Promise<Product>;
    findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: 'newest' | 'price_asc' | 'price_desc';
        clientType?: 'domestic' | 'overseas';
        merchantId?: string;
    }): unknown;
    findOne(id: string): Promise<Product>;
    update(id: string, userId: string, updateData: Partial<Product>): Promise<Product>;
    remove(id: string, userId: string): Promise<void>;
    approve(id: string): Promise<Product>;
    reject(id: string): Promise<Product>;
    getSimilar(id: string, limit?: number): Promise<Product[]>;
}
