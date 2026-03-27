import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        phone: '13800138000',
        code: '123456',
      };

      mockAuthService.register.mockResolvedValue({
        token: 'test-token',
        user: {
          id: '1',
          phone: '13800138000',
          name: 'Test User',
        },
      });

      const result = await controller.register(registerDto);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto = {
        phone: '13800138000',
        code: '123456',
      };

      mockAuthService.login.mockResolvedValue({
        token: 'test-token',
        user: {
          id: '1',
          phone: '13800138000',
          name: 'Test User',
        },
      });

      const result = await controller.login(loginDto);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockAuthService.getProfile.mockResolvedValue({
        id: '1',
        phone: '13800138000',
        name: 'Test User',
      });

      const result = await controller.getProfile(mockUser);
      expect(result).toHaveProperty('id');
      expect(mockAuthService.getProfile).toHaveBeenCalledWith(mockUser.userId);
    });
  });
});
