import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(req: any, createProductDto: any): Promise<import("./entities/product.entity").Product>;
    findAll(req: any, page?: string, limit?: string, search?: string, category?: string, minPrice?: string, maxPrice?: string, sort?: 'newest' | 'price_asc' | 'price_desc'): Promise<{
        success: boolean;
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    getSimilar(id: string, limit?: string): Promise<import("./entities/product.entity").Product[]>;
    update(req: any, id: string, updateProductDto: any): Promise<import("./entities/product.entity").Product>;
    delete(req: any, id: string): {
        success: boolean;
        message: string;
    };
    approve(id: string): Promise<import("./entities/product.entity").Product>;
    reject(id: string): Promise<import("./entities/product.entity").Product>;
}
