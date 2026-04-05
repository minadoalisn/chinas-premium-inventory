import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { SmsService } from '../sms/sms.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let smsService: SmsService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockSmsService = {
    verifyCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: SmsService,
          useValue: mockSmsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    smsService = module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        phone: '13800138000',
        code: '123456',
      };

      mockSmsService.verifyCode.mockResolvedValue(true);
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({
        id: '1',
        phone: '13800138000',
        name: 'User_13800138000',
      });
      mockUserRepository.save.mockResolvedValue({
        id: '1',
        phone: '13800138000',
        name: 'User_13800138000',
      });
      mockJwtService.sign.mockReturnValue('test-token');

      const result = await service.register(registerDto);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const registerDto = {
        phone: '13800138000',
        code: '123456',
      };

      mockSmsService.verifyCode.mockResolvedValue(true);
      mockUserRepository.findOne.mockResolvedValue({
        id: '1',
        phone: '13800138000',
      });

      await expect(service.register(registerDto)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const loginDto = {
        phone: '13800138000',
        code: '123456',
      };

      const mockUser = {
        id: '1',
        phone: '13800138000',
        name: 'Test User',
      };

      mockSmsService.verifyCode.mockResolvedValue(true);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('test-token');

      const result = await service.login(loginDto);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
    });

    it('should throw error if user not found', async () => {
      const loginDto = {
        phone: '13800138000',
        code: '123456',
      };

      mockSmsService.verifyCode.mockResolvedValue(true);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow('User not found');
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const mockUser = {
        id: '1',
        phone: '13800138000',
        name: 'Test User',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile('1');
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Test User');
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('1')).rejects.toThrow('User not found');
    });
  });
});
