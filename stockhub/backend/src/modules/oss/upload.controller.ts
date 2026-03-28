import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  @Post('image')
  @ApiOperation({ summary: '上传图片' })
  async uploadImage() {
    // 简化实现：返回模拟URL
    return {
      success: true,
      url: 'https://example.com/uploads/demo.jpg',
    };
  }

  @Post('file')
  @ApiOperation({ summary: '上传文件' })
  async uploadFile() {
    // 简化实现：返回模拟URL
    return {
      success: true,
      url: 'https://example.com/uploads/demo.pdf',
    };
  }
}
