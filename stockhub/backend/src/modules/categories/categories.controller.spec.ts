import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    initialize: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockCategoriesService.findAll.mockResolvedValue([
        { id: '1', name: 'Electronics', icon: 'ri-smartphone-line', color: 'blue' },
        { id: '2', name: 'Home Appliances', icon: 'ri-home-smile-line', color: 'red' },
      ]);

      const result = await controller.findAll();
      expect(result).toHaveLength(2);
      expect(mockCategoriesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      mockCategoriesService.findOne.mockResolvedValue({
        id: '1',
        name: 'Electronics',
        icon: 'ri-smartphone-line',
        color: 'blue',
      });

      const result = await controller.findOne('1');
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Electronics');
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('initialize', () => {
    it('should initialize categories', async () => {
      const mockUser = {
        userId: '1',
        phone: '13800138000',
        role: 'admin',
      };

      mockCategoriesService.initialize.mockResolvedValue({
        success: true,
        message: 'Categories initialized successfully',
        count: 12,
      });

      const result = await controller.initialize(mockUser);
      expect(result.success).toBe(true);
      expect(result.count).toBe(12);
      expect(mockCategoriesService.initialize).toHaveBeenCalled();
    });
  });
});
