import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { ConfigService } from '@nestjs/config';

describe('UploadService', () => {
  let service: UploadService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test image data'),
        size: 1024,
      } as Express.Multer.File;

      mockConfigService.get.mockImplementation((key) => {
        if (key === 'OSS_REGION') return 'oss-cn-hangzhou';
        if (key === 'OSS_BUCKET') return 'stockhub';
        if (key === 'OSS_ACCESS_KEY_ID') return 'test-key-id';
        if (key === 'OSS_ACCESS_KEY_SECRET') return 'test-key-secret';
        return null;
      });

      // Mock the OSS put method
      const mockPut = jest.fn().mockResolvedValue({
        url: 'https://stockhub.oss-cn-hangzhou.aliyuncs.com/uploads/test.jpg',
      });

      jest.spyOn(service as any, 'getOSSClient').mockReturnValue({
        put: mockPut,
      });

      const result = await service.uploadImage(mockFile);
      expect(result).toHaveProperty('url');
      expect(result.url).toContain('https://stockhub.oss-cn-hangzhou.aliyuncs.com');
    });

    it('should throw error for invalid file type', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('test pdf data'),
        size: 1024,
      } as Express.Multer.File;

      await expect(service.uploadImage(mockFile)).rejects.toThrow('Invalid file type');
    });

    it('should throw error for file size too large', async () => {
      const mockFile = {
        originalname: 'large.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.alloc(6 * 1024 * 1024), // 6MB
        size: 6 * 1024 * 1024,
      } as Express.Multer.File;

      await expect(service.uploadImage(mockFile)).rejects.toThrow('File size too large');
    });
  });

  describe('uploadMultipleImages', () => {
    it('should upload multiple images successfully', async () => {
      const mockFiles = [
        {
          originalname: 'test1.jpg',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test image 1'),
          size: 1024,
        },
        {
          originalname: 'test2.jpg',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test image 2'),
          size: 1024,
        },
      ] as Express.Multer.File[];

      mockConfigService.get.mockImplementation((key) => {
        if (key === 'OSS_REGION') return 'oss-cn-hangzhou';
        if (key === 'OSS_BUCKET') return 'stockhub';
        if (key === 'OSS_ACCESS_KEY_ID') return 'test-key-id';
        if (key === 'OSS_ACCESS_KEY_SECRET') return 'test-key-secret';
        return null;
      });

      const mockPut = jest.fn().mockResolvedValue({
        url: 'https://stockhub.oss-cn-hangzhou.aliyuncs.com/uploads/test.jpg',
      });

      jest.spyOn(service as any, 'getOSSClient').mockReturnValue({
        put: mockPut,
      });

      const result = await service.uploadMultipleImages(mockFiles);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('url');
      expect(result[1]).toHaveProperty('url');
    });
  });

  describe('deleteImage', () => {
    it('should delete image successfully', async () => {
      const imageUrl = 'https://stockhub.oss-cn-hangzhou.aliyuncs.com/uploads/test.jpg';

      mockConfigService.get.mockImplementation((key) => {
        if (key === 'OSS_REGION') return 'oss-cn-hangzhou';
        if (key === 'OSS_BUCKET') return 'stockhub';
        if (key === 'OSS_ACCESS_KEY_ID') return 'test-key-id';
        if (key === 'OSS_ACCESS_KEY_SECRET') return 'test-key-secret';
        return null;
      });

      const mockDelete = jest.fn().mockResolvedValue({});

      jest.spyOn(service as any, 'getOSSClient').mockReturnValue({
        delete: mockDelete,
      });

      const result = await service.deleteImage(imageUrl);
      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
    });
  });
});
