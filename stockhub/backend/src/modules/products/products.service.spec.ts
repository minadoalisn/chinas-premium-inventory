import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CategoryService } from '../categories/categories.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let categoryService: CategoryService;

  const mockProductRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoryService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        title: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 50,
        categoryId: '1',
        images: ['https://example.com/image.jpg'],
      };

      const mockCategory = {
        id: '1',
        name: 'Electronics',
      };

      categoryService.findOne.mockResolvedValue(mockCategory);
      mockProductRepository.create.mockReturnValue({
        id: '1',
        ...createProductDto,
        merchantId: '1',
        status: 'pending',
      });
      mockProductRepository.save.mockResolvedValue({
        id: '1',
        ...createProductDto,
        merchantId: '1',
        status: 'pending',
      });

      const result = await service.create('1', createProductDto);
      expect(result).toHaveProperty('id');
      expect(result.status).toBe('pending');
    });
  });

  describe('findAll', () => {
    it('should return all products with pagination', async () => {
      const query = {
        page: 1,
        limit: 10,
        categoryId: '1',
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([
          [{ id: '1', title: 'Product 1' }, { id: '2', title: 'Product 2' }],
          2,
        ]),
      };

      mockProductRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(query);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockProduct = {
        id: '1',
        title: 'Test Product',
        price: 100,
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Product');
    });

    it('should throw error if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow('Product not found');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = {
        title: 'Updated Product',
        price: 150,
      };

      const mockProduct = {
        id: '1',
        title: 'Old Product',
        price: 100,
        merchantId: '1',
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.save.mockResolvedValue({
        ...mockProduct,
        ...updateProductDto,
      });

      const result = await service.update('1', '1', updateProductDto);
      expect(result.title).toBe('Updated Product');
      expect(result.price).toBe(150);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const mockProduct = {
        id: '1',
        merchantId: '1',
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('1', '1');
      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
    });
  });

  describe('findSimilar', () => {
    it('should find similar products', async () => {
      const mockProduct = {
        id: '1',
        title: 'iPhone 13',
        categoryId: '1',
      };

      const mockSimilarProducts = [
        { id: '2', title: 'iPhone 12' },
        { id: '3', title: 'iPhone 14' },
      ];

      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.find.mockResolvedValue(mockSimilarProducts);

      const result = await service.findSimilar('1');
      expect(result).toHaveLength(2);
    });
  });
});
