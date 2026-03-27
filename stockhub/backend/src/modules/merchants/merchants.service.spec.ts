import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantsService } from './merchants.service';
import { Merchant } from './entities/merchant.entity';

describe('MerchantsService', () => {
  let service: MerchantsService;
  let merchantRepository: Repository<Merchant>;

  const mockMerchantRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantsService,
        {
          provide: getRepositoryToken(Merchant),
          useValue: mockMerchantRepository,
        },
      ],
    }).compile();

    service = module.get<MerchantsService>(MerchantsService);
    merchantRepository = module.get<Repository<Merchant>>(getRepositoryToken(Merchant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should get merchant profile', async () => {
      const mockMerchant = {
        id: '1',
        name: 'Test Merchant',
        company: 'Test Company',
        status: 'approved',
      };

      mockMerchantRepository.findOne.mockResolvedValue(mockMerchant);

      const result = await service.getProfile('1');
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Test Merchant');
    });

    it('should throw error if merchant not found', async () => {
      mockMerchantRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('1')).rejects.toThrow('Merchant not found');
    });
  });

  describe('updateProfile', () => {
    it('should update merchant profile', async () => {
      const updateProfileDto = {
        name: 'Updated Merchant',
        company: 'Updated Company',
        description: 'Test Description',
      };

      const mockMerchant = {
        id: '1',
        name: 'Old Merchant',
        company: 'Old Company',
      };

      mockMerchantRepository.findOne.mockResolvedValue(mockMerchant);
      mockMerchantRepository.save.mockResolvedValue({
        ...mockMerchant,
        ...updateProfileDto,
      });

      const result = await service.updateProfile('1', updateProfileDto);
      expect(result.name).toBe('Updated Merchant');
      expect(result.company).toBe('Updated Company');
    });
  });

  describe('applyForMerchant', () => {
    it('should apply for merchant account', async () => {
      const applyDto = {
        name: 'New Merchant',
        company: 'New Company',
        description: 'Test Description',
      };

      mockMerchantRepository.findOne.mockResolvedValue(null);
      mockMerchantRepository.create.mockReturnValue({
        id: '1',
        ...applyDto,
        status: 'pending',
      });
      mockMerchantRepository.save.mockResolvedValue({
        id: '1',
        ...applyDto,
        status: 'pending',
      });

      const result = await service.applyForMerchant('1', applyDto);
      expect(result.status).toBe('pending');
      expect(result.name).toBe('New Merchant');
    });

    it('should throw error if merchant already exists', async () => {
      const applyDto = {
        name: 'New Merchant',
      };

      mockMerchantRepository.findOne.mockResolvedValue({
        id: '1',
        name: 'Existing Merchant',
      });

      await expect(service.applyForMerchant('1', applyDto)).rejects.toThrow('Merchant already exists');
    });
  });
});
