import { Test, TestingModule } from '@nestjs/testing';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('InquiriesController', () => {
  let controller: InquiriesController;
  let service: InquiriesService;

  const mockInquiriesService = {
    create: jest.fn(),
    findMyInquiries: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InquiriesController],
      providers: [
        {
          provide: InquiriesService,
          useValue: mockInquiriesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<InquiriesController>(InquiriesController);
    service = module.get<InquiriesService>(InquiriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new inquiry', async () => {
      const createInquiryDto = {
        productId: '1',
        message: 'I am interested in this product',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockInquiriesService.create.mockResolvedValue({
        id: '1',
        productId: '1',
        message: 'I am interested in this product',
        status: 'pending',
      });

      const result = await controller.create(mockUser, createInquiryDto);
      expect(result).toHaveProperty('id');
      expect(result.status).toBe('pending');
      expect(mockInquiriesService.create).toHaveBeenCalledWith(
        mockUser.userId,
        createInquiryDto,
      );
    });
  });

  describe('findMyInquiries', () => {
    it('should return my inquiries', async () => {
      const query = {
        page: 1,
        limit: 10,
        status: 'pending',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockInquiriesService.findMyInquiries.mockResolvedValue({
        data: [
          { id: '1', message: 'Inquiry 1', status: 'pending' },
          { id: '2', message: 'Inquiry 2', status: 'pending' },
        ],
        total: 2,
        page: 1,
        limit: 10,
      });

      const result = await controller.findMyInquiries(mockUser, query);
      expect(result.data).toHaveLength(2);
      expect(mockInquiriesService.findMyInquiries).toHaveBeenCalledWith(
        mockUser.userId,
        query,
      );
    });
  });

  describe('update', () => {
    it('should update an inquiry', async () => {
      const updateInquiryDto = {
        status: 'replied',
        replyMessage: 'We have stock available',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockInquiriesService.update.mockResolvedValue({
        id: '1',
        status: 'replied',
        replyMessage: 'We have stock available',
      });

      const result = await controller.update('1', mockUser, updateInquiryDto);
      expect(result.status).toBe('replied');
      expect(mockInquiriesService.update).toHaveBeenCalledWith(
        '1',
        mockUser.userId,
        updateInquiryDto,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single inquiry', async () => {
      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockInquiriesService.findOne.mockResolvedValue({
        id: '1',
        message: 'Test inquiry',
        status: 'pending',
      });

      const result = await controller.findOne('1', mockUser);
      expect(result).toHaveProperty('id');
      expect(result.message).toBe('Test inquiry');
      expect(mockInquiriesService.findOne).toHaveBeenCalledWith('1', mockUser.userId);
    });
  });
});
