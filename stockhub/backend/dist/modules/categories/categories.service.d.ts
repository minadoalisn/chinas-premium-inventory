import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    initializeCategories(): Promise<void>;
    findAll(): unknown;
    findOne(id: string): unknown;
    findByIds(ids: string[]): unknown;
}
