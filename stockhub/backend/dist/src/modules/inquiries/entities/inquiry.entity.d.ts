import { User } from '../../users/entities/user.entity';
export declare class Inquiry {
    id: string;
    buyerId: string;
    buyer: User;
    buyerCompanyName: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    productIds: string[];
    productDetails: string;
    message: string;
    status: string;
    buyerViewedAt: Date;
    merchantReply: string;
    merchantViewedAt: Date;
    lastActivityAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
