import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandsService } from './demands.service';
import { Demand } from './entities/demand.entity';
import { CategoryService } from '../categories/categories.service';

describe('DemandsService', () => {
  let service: DemandsService;
  let demandRepository: Repository<Demand>;
  let categoryService: CategoryService;

  const mockDemandRepository = {
    createQueryBuilder: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
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
        DemandsService,
        {
          provide: getRepositoryToken(Demand),
          useValue: mockDemandRepository,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<DemandsService>(DemandsService);
    demandRepository = module.get<Repository<Demand>>(getRepositoryToken(Demand));
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new demand', async () => {
      const createDemandDto = {
        title: 'Test Demand',
        description: 'Test Description',
        quantity: 100,
        price: 1000,
        categoryId: '1',
      };

      const mockCategory = {
        id: '1',
        name: 'Electronics',
      };

      mockCategoryService.findOne.mockResolvedValue(mockCategory);
      mockDemandRepository.create.mockReturnValue({
        id: '1',
        ...createDemandDto,
        userId: '1',
      });
      mockDemandRepository.save.mockResolvedValue({
        id: '1',
        ...createDemandDto,
        userId: '1',
      });

      const result = await service.create('1', createDemandDto);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Demand');
    });
  });

  describe('findAll', () => {
    it('should return all demands with pagination', async () => {
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
          [{ id: '1', title: 'Demand 1' }, { id: '2', title: 'Demand 2' }],
          2,
        ]),
      };

      mockDemandRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(query);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('findMyDemands', () => {
    it('should return my demands', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([
          [{ id: '1', title: 'My Demand' }],
          1,
        ]),
      };

      mockDemandRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findMyDemands('1', { page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('My Demand');
    });
  });

  describe('update', () => {
    it('should update a demand', async () => {
      const updateDemandDto = {
        title: 'Updated Demand',
        quantity: 150,
      };

      const mockDemand = {
        id: '1',
        title: 'Old Demand',
        quantity: 100,
        userId: '1',
      };

      mockDemandRepository.findOne.mockResolvedValue(mockDemand);
      mockDemandRepository.save.mockResolvedValue({
        ...mockDemand,
        ...updateDemandDto,
      });

      const result = await service.update('1', '1', updateDemandDto);
      expect(result.title).toBe('Updated Demand');
      expect(result.quantity).toBe(150);
    });

    it('should throw error if demand not found', async () => {
      mockDemandRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', '1', { title: 'Updated' })).rejects.toThrow('Demand not found');
    });

    it('should throw error if not owner', async () => {
      const mockDemand = {
        id: '1',
        userId: '2', // Different user
      };

      mockDemandRepository.findOne.mockResolvedValue(mockDemand);

      await expect(service.update('1', '1', { title: 'Updated' })).rejects.toThrow('Unauthorized');
    });
  });
});
