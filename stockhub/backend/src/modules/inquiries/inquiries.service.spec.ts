import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './entities/inquiry.entity';
import { ProductsService } from '../products/products.service';

describe('InquiriesService', () => {
  let service: InquiriesService;
  let inquiryRepository: Repository<Inquiry>;
  let productsService: ProductsService;

  const mockInquiryRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockProductsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InquiriesService,
        {
          provide: getRepositoryToken(Inquiry),
          useValue: mockInquiryRepository,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<InquiriesService>(InquiriesService);
    inquiryRepository = module.get<Repository<Inquiry>>(getRepositoryToken(Inquiry));
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new inquiry', async () => {
      const createInquiryDto = {
        productId: '1',
        message: 'I am interested in this product',
      };

      const mockProduct = {
        id: '1',
        title: 'Test Product',
        merchantId: '2',
      };

      productsService.findOne.mockResolvedValue(mockProduct);
      mockInquiryRepository.create.mockReturnValue({
        id: '1',
        ...createInquiryDto,
        buyerId: '1',
        sellerId: '2',
        status: 'pending',
      });
      mockInquiryRepository.save.mockResolvedValue({
        id: '1',
        ...createInquiryDto,
        buyerId: '1',
        sellerId: '2',
        status: 'pending',
      });

      const result = await service.create('1', createInquiryDto);
      expect(result).toHaveProperty('id');
      expect(result.status).toBe('pending');
      expect(result.buyerId).toBe('1');
      expect(result.sellerId).toBe('2');
    });
  });

  describe('findMyInquiries', () => {
    it('should return my inquiries', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([
          [{ id: '1', message: 'My Inquiry', buyerId: '1' }],
          1,
        ]),
      };

      mockInquiryRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findMyInquiries('1', { page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].buyerId).toBe('1');
    });
  });

  describe('findOne', () => {
    it('should return a single inquiry', async () => {
      const mockInquiry = {
        id: '1',
        message: 'Test inquiry',
        buyerId: '1',
        sellerId: '2',
      };

      mockInquiryRepository.findOne.mockResolvedValue(mockInquiry);

      const result = await service.findOne('1', '1');
      expect(result).toHaveProperty('id');
      expect(result.message).toBe('Test inquiry');
    });

    it('should throw error if inquiry not found', async () => {
      mockInquiryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', '1')).rejects.toThrow('Inquiry not found');
    });

    it('should throw error if not authorized', async () => {
      const mockInquiry = {
        id: '1',
        buyerId: '2',
        sellerId: '3',
      };

      mockInquiryRepository.findOne.mockResolvedValue(mockInquiry);

      await expect(service.findOne('1', '1')).rejects.toThrow('Unauthorized');
    });
  });

  describe('update', () => {
    it('should update an inquiry', async () => {
      const updateInquiryDto = {
        status: 'replied',
        replyMessage: 'We have stock available',
      };

      const mockInquiry = {
        id: '1',
        sellerId: '1',
        status: 'pending',
      };

      mockInquiryRepository.findOne.mockResolvedValue(mockInquiry);
      mockInquiryRepository.save.mockResolvedValue({
        ...mockInquiry,
        ...updateInquiryDto,
      });

      const result = await service.update('1', '1', updateInquiryDto);
      expect(result.status).toBe('replied');
      expect(result.replyMessage).toBe('We have stock available');
    });
  });
});
