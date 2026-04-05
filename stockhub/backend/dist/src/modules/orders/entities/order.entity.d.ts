export declare class Order {
    id: string;
    orderNo: string;
    buyerId: string;
    merchantId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    currency: string;
    paymentStatus: string;
    depositAmount: number;
    depositPaidAt: Date;
    balancePaidAt: Date;
    shippingMethod: string;
    trackingNumber: string;
    carrier: string;
    shippingAddress: string;
    shippingCost: number;
    status: string;
    orderNotes: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
