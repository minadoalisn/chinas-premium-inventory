import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    updateProfile: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateProfileDto = {
        name: 'Updated Name',
        avatar: 'https://example.com/avatar.jpg',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockUsersService.updateProfile.mockResolvedValue({
        id: '1',
        phone: '13800138000',
        name: 'Updated Name',
        avatar: 'https://example.com/avatar.jpg',
      });

      const result = await controller.updateProfile(mockUser, updateProfileDto);
      expect(result.name).toBe('Updated Name');
      expect(mockUsersService.updateProfile).toHaveBeenCalledWith(
        mockUser.userId,
        updateProfileDto,
      );
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const updatePasswordDto = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };

      const mockUser = {
        userId: '1',
        phone: '13800138000',
      };

      mockUsersService.updatePassword.mockResolvedValue({
        success: true,
        message: 'Password updated successfully',
      });

      const result = await controller.updatePassword(mockUser, updatePasswordDto);
      expect(result.success).toBe(true);
      expect(mockUsersService.updatePassword).toHaveBeenCalledWith(
        mockUser.userId,
        updatePasswordDto,
      );
    });
  });
});
