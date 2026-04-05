import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): unknown;
    findOne(id: string): unknown;
    create(data: any): unknown;
}
