import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    approve: jest.fn(),
    reject: jest.fn(),
    findSimilar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockProductsService.create.mockResolvedValue({
        id: '1',
        title: 'Test Product',
        price: 100,
        status: 'pending',
      });

      const result = await controller.create(mockUser, createProductDto);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Product');
      expect(mockProductsService.create).toHaveBeenCalledWith(
        mockUser.userId,
        createProductDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const query = {
        page: 1,
        limit: 10,
        categoryId: '1',
      };

      mockProductsService.findAll.mockResolvedValue({
        data: [
          { id: '1', title: 'Product 1', price: 100 },
          { id: '2', title: 'Product 2', price: 200 },
        ],
        total: 2,
        page: 1,
        limit: 10,
      });

      const result = await controller.findAll(query);
      expect(result.data).toHaveLength(2);
      expect(mockProductsService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      mockProductsService.findOne.mockResolvedValue({
        id: '1',
        title: 'Test Product',
        price: 100,
      });

      const result = await controller.findOne('1');
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Product');
      expect(mockProductsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = {
        title: 'Updated Product',
        price: 150,
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockProductsService.update.mockResolvedValue({
        id: '1',
        title: 'Updated Product',
        price: 150,
      });

      const result = await controller.update('1', mockUser, updateProductDto);
      expect(result.title).toBe('Updated Product');
      expect(mockProductsService.update).toHaveBeenCalledWith(
        '1',
        mockUser.userId,
        updateProductDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockProductsService.remove.mockResolvedValue({
        success: true,
        message: 'Product deleted successfully',
      });

      const result = await controller.remove('1', mockUser);
      expect(result.success).toBe(true);
      expect(mockProductsService.remove).toHaveBeenCalledWith('1', mockUser.userId);
    });
  });

  describe('approve', () => {
    it('should approve a product', async () => {
      const mockUser = {
        userId: '1',
        phone: '13800138000',
        role: 'admin',
      };

      mockProductsService.approve.mockResolvedValue({
        id: '1',
        status: 'approved',
      });

      const result = await controller.approve('1', mockUser);
      expect(result.status).toBe('approved');
      expect(mockProductsService.approve).toHaveBeenCalledWith('1', mockUser);
    });
  });

  describe('reject', () => {
    it('should reject a product', async () => {
      const mockUser = {
        userId: '1',
        phone: '13800138000',
        role: 'admin',
      };

      mockProductsService.reject.mockResolvedValue({
        id: '1',
        status: 'rejected',
      });

      const result = await controller.reject('1', mockUser);
      expect(result.status).toBe('rejected');
      expect(mockProductsService.reject).toHaveBeenCalledWith('1', mockUser);
    });
  });

  describe('findSimilar', () => {
    it('should find similar products', async () => {
      mockProductsService.findSimilar.mockResolvedValue([
        { id: '2', title: 'Similar Product', price: 110 },
        { id: '3', title: 'Another Similar', price: 105 },
      ]);

      const result = await controller.findSimilar('1');
      expect(result).toHaveLength(2);
      expect(mockProductsService.findSimilar).toHaveBeenCalledWith('1');
    });
  });
});
