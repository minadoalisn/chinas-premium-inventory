import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { ProductsService } from '../products/products.service';
import { MerchantsService } from '../merchants/merchants.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let productsService: ProductsService;
  let merchantsService: MerchantsService;

  const mockOrderRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockProductsService = {
    findOne: jest.fn(),
  };

  const mockMerchantsService = {
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: MerchantsService,
          useValue: mockMerchantsService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    productsService = module.get<ProductsService>(ProductsService);
    merchantsService = module.get<MerchantsService>(MerchantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        productId: '1',
        quantity: 10,
        totalPrice: 1000,
        address: '123 Test Street',
      };

      const mockProduct = {
        id: '1',
        title: 'Test Product',
        price: 100,
        merchantId: '2',
        quantity: 50,
      };

      const mockMerchant = {
        id: '2',
        name: 'Test Merchant',
      };

      productsService.findOne.mockResolvedValue(mockProduct);
      merchantsService.getProfile.mockResolvedValue(mockMerchant);
      mockOrderRepository.create.mockReturnValue({
        id: '1',
        ...createOrderDto,
        buyerId: '1',
        sellerId: '2',
        status: 'pending',
      });
      mockOrderRepository.save.mockResolvedValue({
        id: '1',
        ...createOrderDto,
        buyerId: '1',
        sellerId: '2',
        status: 'pending',
      });

      const result = await service.create('1', createOrderDto);
      expect(result).toHaveProperty('id');
      expect(result.status).toBe('pending');
      expect(result.buyerId).toBe('1');
      expect(result.sellerId).toBe('2');
    });

    it('should throw error if insufficient stock', async () => {
      const createOrderDto = {
        productId: '1',
        quantity: 100, // More than available
        totalPrice: 10000,
        address: '123 Test Street',
      };

      const mockProduct = {
        id: '1',
        price: 100,
        quantity: 50, // Only 50 available
        merchantId: '2',
      };

      productsService.findOne.mockResolvedValue(mockProduct);

      await expect(service.create('1', createOrderDto)).rejects.toThrow('Insufficient stock');
    });
  });

  describe('findMyOrders', () => {
    it('should return my orders', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([
          [{ id: '1', quantity: 10, buyerId: '1' }],
          1,
        ]),
      };

      mockOrderRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findMyOrders('1', { page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].buyerId).toBe('1');
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const mockOrder = {
        id: '1',
        quantity: 10,
        buyerId: '1',
        sellerId: '2',
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne('1', '1');
      expect(result).toHaveProperty('id');
      expect(result.quantity).toBe(10);
    });

    it('should throw error if order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', '1')).rejects.toThrow('Order not found');
    });

    it('should throw error if not authorized', async () => {
      const mockOrder = {
        id: '1',
        buyerId: '2',
        sellerId: '3',
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      await expect(service.findOne('1', '1')).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const updateStatusDto = {
        status: 'confirmed',
      };

      const mockOrder = {
        id: '1',
        sellerId: '1',
        status: 'pending',
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue({
        ...mockOrder,
        ...updateStatusDto,
      });

      const result = await service.updateStatus('1', '1', updateStatusDto);
      expect(result.status).toBe('confirmed');
    });

    it('should throw error if only seller can confirm', async () => {
      const updateStatusDto = {
        status: 'confirmed',
      };

      const mockOrder = {
        id: '1',
        sellerId: '2', // Different seller
        buyerId: '1',
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      await expect(service.updateStatus('1', '1', updateStatusDto)).rejects.toThrow('Only seller can confirm order');
    });
  });
});
