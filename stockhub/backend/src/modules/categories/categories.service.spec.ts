import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<Category>;

  const mockCategoryRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Electronics', icon: 'ri-smartphone-line', color: 'blue' },
        { id: '2', name: 'Home Appliances', icon: 'ri-home-smile-line', color: 'red' },
      ];

      mockCategoryRepository.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Electronics');
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      const mockCategory = {
        id: '1',
        name: 'Electronics',
        icon: 'ri-smartphone-line',
        color: 'blue',
      };

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne('1');
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Electronics');
    });

    it('should throw error if category not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow('Category not found');
    });
  });

  describe('initialize', () => {
    it('should initialize categories', async () => {
      const initialCategories = [
        { id: '1', name: 'Electronics' },
        { id: '2', name: 'Home Appliances' },
      ];

      mockCategoryRepository.find.mockResolvedValue([]);
      mockCategoryRepository.create.mockImplementation((data) => data);
      mockCategoryRepository.save.mockImplementation(async (data) => ({
        ...data,
        id: '1',
      }));

      const result = await service.initialize();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('count');
    });

    it('should skip if categories already exist', async () => {
      const mockCategories = [{ id: '1', name: 'Electronics' }];

      mockCategoryRepository.find.mockResolvedValue(mockCategories);

      const result = await service.initialize();
      expect(result.message).toContain('already initialized');
    });
  });
});
