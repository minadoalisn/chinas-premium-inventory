import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateProfileDto = {
        name: 'Updated Name',
        avatar: 'https://example.com/avatar.jpg',
      };

      const mockUser = {
        id: '1',
        phone: '13800138000',
        name: 'Old Name',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        ...updateProfileDto,
      });

      const result = await service.updateProfile('1', updateProfileDto);
      expect(result.name).toBe('Updated Name');
      expect(result.avatar).toBe('https://example.com/avatar.jpg');
    });

    it('should throw error if user not found', async () => {
      const updateProfileDto = {
        name: 'Updated Name',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateProfile('1', updateProfileDto)).rejects.toThrow('User not found');
    });
  });

  describe('updatePassword', () => {
    it('should update password', async () => {
      const updatePasswordDto = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };

      const mockUser = {
        id: '1',
        phone: '13800138000',
        password: await bcrypt.hash('oldPassword123', 10),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        password: await bcrypt.hash('newPassword123', 10),
      });

      const result = await service.updatePassword('1', updatePasswordDto);
      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
    });

    it('should throw error if old password is incorrect', async () => {
      const updatePasswordDto = {
        oldPassword: 'wrongPassword',
        newPassword: 'newPassword123',
      };

      const mockUser = {
        id: '1',
        phone: '13800138000',
        password: await bcrypt.hash('oldPassword123', 10),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.updatePassword('1', updatePasswordDto)).rejects.toThrow('Invalid password');
    });

    it('should throw error if user not found', async () => {
      const updatePasswordDto = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updatePassword('1', updatePasswordDto)).rejects.toThrow('User not found');
    });
  });
});
