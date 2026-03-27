import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';
import * as https from 'https';

describe('SmsService', () => {
  let service: SmsService;

  // Mock Redis cache
  const mockCache = new Map<string, { code: string; timestamp: number }>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsService],
    }).compile();

    service = module.get<SmsService>(SmsService);

    // Clear cache before each test
    mockCache.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendCode', () => {
    it('should send SMS code successfully', async () => {
      // Mock https.request
      const mockHttpsRequest = jest.spyOn(https, 'request').mockImplementation((options, callback) => {
        const mockRes = {
          statusCode: 200,
          on: jest.fn((event, handler) => {
            if (event === 'data') {
              handler(Buffer.from('0')); // Success
            }
          }),
        } as any;

        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn(),
        } as any;
      });

      const result = await service.sendCode('13800138000');
      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('code');

      mockHttpsRequest.mockRestore();
    });

    it('should prevent duplicate SMS within 60 seconds', async () => {
      const mockHttpsRequest = jest.spyOn(https, 'request').mockImplementation((options, callback) => {
        const mockRes = {
          statusCode: 200,
          on: jest.fn((event, handler) => {
            if (event === 'data') {
              handler(Buffer.from('0'));
            }
          }),
        } as any;
        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn(),
        } as any;
      });

      // First send
      await service.sendCode('13800138000');

      // Second send within 60 seconds
      await expect(service.sendCode('13800138000')).rejects.toThrow('Please wait 60 seconds before sending another code');

      mockHttpsRequest.mockRestore();
    });
  });

  describe('verifyCode', () => {
    it('should verify correct code', async () => {
      const mockHttpsRequest = jest.spyOn(https, 'request').mockImplementation((options, callback) => {
        const mockRes = {
          statusCode: 200,
          on: jest.fn((event, handler) => {
            if (event === 'data') {
              handler(Buffer.from('0'));
            }
          }),
        } as any;
        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn(),
        } as any;
      });

      // Send code first
      const sendResult = await service.sendCode('13800138000');
      const code = sendResult.code;

      // Verify code
      const verifyResult = await service.verifyCode('13800138000', code);
      expect(verifyResult).toBe(true);

      mockHttpsRequest.mockRestore();
    });

    it('should reject incorrect code', async () => {
      const mockHttpsRequest = jest.spyOn(https, 'request').mockImplementation((options, callback) => {
        const mockRes = {
          statusCode: 200,
          on: jest.fn((event, handler) => {
            if (event === 'data') {
              handler(Buffer.from('0'));
            }
          }),
        } as any;
        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn(),
        } as any;
      });

      // Send code first
      await service.sendCode('13800138000');

      // Verify with wrong code
      const verifyResult = await service.verifyCode('13800138000', '999999');
      expect(verifyResult).toBe(false);

      mockHttpsRequest.mockRestore();
    });

    it('should reject expired code (> 5 minutes)', async () => {
      const mockHttpsRequest = jest.spyOn(https, 'request').mockImplementation((options, callback) => {
        const mockRes = {
          statusCode: 200,
          on: jest.fn((event, handler) => {
            if (event === 'data') {
              handler(Buffer.from('0'));
            }
          }),
        } as any;
        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn(),
        } as any;
      });

      // Send code first
      const sendResult = await service.sendCode('13800138000');

      // Simulate expired code by modifying cache
      const cacheKey = `sms_code_13800138000`;
      const cached = mockCache.get(cacheKey);
      if (cached) {
        cached.timestamp = Date.now() - 6 * 60 * 1000; // 6 minutes ago
        mockCache.set(cacheKey, cached);
      }

      // Verify expired code
      const verifyResult = await service.verifyCode('13800138000', sendResult.code);
      expect(verifyResult).toBe(false);

      mockHttpsRequest.mockRestore();
    });
  });
});
