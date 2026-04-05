import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../modules/categories/entities/category.entity';
export declare class DataSeederService implements OnModuleInit {
    private categoriesRepository;
    private readonly logger;
    constructor(categoriesRepository: Repository<Category>);
    onModuleInit(): Promise<void>;
    private initializeCategories;
}
