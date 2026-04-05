import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    initialize(): Promise<{
        message: string;
    }>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(data: Partial<Category>): Promise<any>;
    update(id: string, data: Partial<Category>): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
