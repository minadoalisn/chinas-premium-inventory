import { MerchantsService } from './merchants.service';
export declare class MerchantsController {
    private readonly merchantsService;
    constructor(merchantsService: MerchantsService);
    findAll(query: any): unknown;
    findOne(id: string): unknown;
    getProducts(id: string, query: any): unknown;
    create(req: any, data: any): unknown;
    update(id: string, updateData: any): unknown;
}
