export declare class CreateProductDto {
    title: string;
    description?: string;
    categoryId?: number;
    stockQty: number;
    domesticPrice: number;
    overseasPrice?: number;
    isExpired?: boolean;
    expireDate?: Date;
    images?: string[];
    specifications?: Record<string, any>;
}
