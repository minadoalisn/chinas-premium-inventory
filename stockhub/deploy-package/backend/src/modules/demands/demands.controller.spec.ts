import { Test, TestingModule } from '@nestjs/testing';
import { DemandsController } from './demands.controller';
import { DemandsService } from './demands.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('DemandsController', () => {
  let controller: DemandsController;
  let service: DemandsService;

  const mockDemandsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findMyDemands: jest.fn(),
    findOne: jest.fn(),
    match: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandsController],
      providers: [
        {
          provide: DemandsService,
          useValue: mockDemandsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<DemandsController>(DemandsController);
    service = module.get<DemandsService>(DemandsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a demand', async () => {
      const createDemandDto = {
        title: 'Test Demand',
        description: 'Test Description',
        category: '电子产品',
        quantity: 100,
        unit: '件',
        priceRange: '100-200',
      };

      mockDemandsService.create.mockResolvedValue({
        id: '1',
        ...createDemandDto,
      });

      const result = await controller.create(createDemandDto, { userId: '1' });
      expect(result).toHaveProperty('id');
      expect(mockDemandsService.create).toHaveBeenCalledWith(createDemandDto, '1');
    });
  });

  describe('findAll', () => {
    it('should return all demands', async () => {
      mockDemandsService.findAll.mockResolvedValue([
        { id: '1', title: 'Demand 1' },
        { id: '2', title: 'Demand 2' },
      ]);

      const result = await controller.findAll();
      expect(result).toHaveLength(2);
      expect(mockDemandsService.findAll).toHaveBeenCalled();
    });
  });
});
