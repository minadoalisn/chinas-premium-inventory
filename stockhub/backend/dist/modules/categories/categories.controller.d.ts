import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    initialize(): unknown;
    findAll(): unknown;
    findOne(id: string): unknown;
}
