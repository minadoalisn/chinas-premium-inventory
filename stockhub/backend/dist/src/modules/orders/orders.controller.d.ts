import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<{
        data: any[];
        total: number;
    }>;
    findOne(id: string): Promise<any>;
    create(data: any): Promise<any>;
}
