import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OssService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: any, folder: string = 'uploads') {
    // 简化实现：返回模拟URL
    return {
      url: `https://example.com/${folder}/demo.jpg`,
      fileName: file.originalname || 'demo.jpg',
      fileKey: `uploads/${Date.now()}-${file.originalname}`,
      fileSize: file.size || 0,
    };
  }

  async deleteFile(fileKey: string) {
    // 简化实现
    return { success: true };
  }

  getFileUrl(fileKey: string) {
    // 简化实现
    return `https://example.com/${fileKey}`;
  }
}
