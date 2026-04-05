import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    initializeCategories(): Promise<void>;
    private generateSlug;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    findByIds(ids: string[]): Promise<any>;
    create(data: Partial<Category>): Promise<any>;
    update(id: string, data: Partial<Category>): Promise<any>;
    delete(id: string): Promise<any>;
}
