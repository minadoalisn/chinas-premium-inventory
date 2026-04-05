import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    findMyOrders: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        productId: '1',
        quantity: 10,
        totalPrice: 1000,
        address: '123 Test Street',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockOrdersService.create.mockResolvedValue({
        id: '1',
        productId: '1',
        quantity: 10,
        totalPrice: 1000,
        status: 'pending',
      });

      const result = await controller.create(mockUser, createOrderDto);
      expect(result).toHaveProperty('id');
      expect(result.status).toBe('pending');
      expect(mockOrdersService.create).toHaveBeenCalledWith(
        mockUser.userId,
        createOrderDto,
      );
    });
  });

  describe('findMyOrders', () => {
    it('should return my orders', async () => {
      const query = {
        page: 1,
        limit: 10,
        status: 'pending',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockOrdersService.findMyOrders.mockResolvedValue({
        data: [
          { id: '1', quantity: 10, status: 'pending' },
          { id: '2', quantity: 5, status: 'pending' },
        ],
        total: 2,
        page: 1,
        limit: 10,
      });

      const result = await controller.findMyOrders(mockUser, query);
      expect(result.data).toHaveLength(2);
      expect(mockOrdersService.findMyOrders).toHaveBeenCalledWith(
        mockUser.userId,
        query,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockOrdersService.findOne.mockResolvedValue({
        id: '1',
        quantity: 10,
        totalPrice: 1000,
        status: 'pending',
      });

      const result = await controller.findOne('1', mockUser);
      expect(result).toHaveProperty('id');
      expect(result.quantity).toBe(10);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith('1', mockUser.userId);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const updateStatusDto = {
        status: 'confirmed',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockOrdersService.updateStatus.mockResolvedValue({
        id: '1',
        status: 'confirmed',
      });

      const result = await controller.updateStatus('1', mockUser, updateStatusDto);
      expect(result.status).toBe('confirmed');
      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith(
        '1',
        mockUser.userId,
        updateStatusDto,
      );
    });
  });
});
