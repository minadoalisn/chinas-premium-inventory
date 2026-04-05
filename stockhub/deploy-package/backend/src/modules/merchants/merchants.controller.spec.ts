import { Test, TestingModule } from '@nestjs/testing';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('MerchantsController', () => {
  let controller: MerchantsController;
  let service: MerchantsService;

  const mockMerchantsService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    applyForMerchant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantsController],
      providers: [
        {
          provide: MerchantsService,
          useValue: mockMerchantsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<MerchantsController>(MerchantsController);
    service = module.get<MerchantsService>(MerchantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should get merchant profile', async () => {
      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockMerchantsService.getProfile.mockResolvedValue({
        id: '1',
        name: 'Test Merchant',
        company: 'Test Company',
        status: 'approved',
      });

      const result = await controller.getProfile(mockUser);
      expect(result).toHaveProperty('name');
      expect(mockMerchantsService.getProfile).toHaveBeenCalledWith(mockUser.userId);
    });
  });

  describe('updateProfile', () => {
    it('should update merchant profile', async () => {
      const updateProfileDto = {
        name: 'Updated Merchant',
        company: 'Updated Company',
        description: 'Test Description',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockMerchantsService.updateProfile.mockResolvedValue({
        id: '1',
        name: 'Updated Merchant',
        company: 'Updated Company',
        description: 'Test Description',
      });

      const result = await controller.updateProfile(mockUser, updateProfileDto);
      expect(result.name).toBe('Updated Merchant');
      expect(mockMerchantsService.updateProfile).toHaveBeenCalledWith(
        mockUser.userId,
        updateProfileDto,
      );
    });
  });

  describe('applyForMerchant', () => {
    it('should apply for merchant account', async () => {
      const applyDto = {
        name: 'New Merchant',
        company: 'New Company',
        description: 'Test Description',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockMerchantsService.applyForMerchant.mockResolvedValue({
        id: '1',
        name: 'New Merchant',
        company: 'New Company',
        status: 'pending',
      });

      const result = await controller.applyForMerchant(mockUser, applyDto);
      expect(result.status).toBe('pending');
      expect(mockMerchantsService.applyForMerchant).toHaveBeenCalledWith(
        mockUser.userId,
        applyDto,
      );
    });
  });
});
