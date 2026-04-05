import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class Demand {
    id: string;
    buyerId: string;
    buyer: User;
    categoryId: number;
    category: Category;
    title: string;
    minQty: number;
    maxPrice: number;
    demandDesc: string;
    location: string;
    status: string;
    matchedCount: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
