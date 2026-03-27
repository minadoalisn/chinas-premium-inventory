import { Controller, Post, Delete, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from './oss.service';

@ApiTags('文件上传')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly ossService: OssService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5242880 }, // 5MB
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
        return callback(new Error('只支持上传图片'), false);
      }
      callback(null, true);
    },
  }))
  @ApiOperation({ summary: '上传图片' })
  @ApiResponse({ status: 201, description: '上传成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  async uploadImage(
    @Request() req,
    @Body() body: { folder?: string },
    @UploadedFile() file: Express.Multer.File
  ) {
    const folder = body.folder || 'images';
    return this.ossService.uploadFile(file, folder);
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10485760 }, // 10MB
    fileFilter: (req, file, callback) => {
      // 允许的文件类型
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
        'application/x-zip-compressed',
        'text/plain',
        'application/json',
      ];
      
      if (!allowedTypes.includes(file.mimetype)) {
        return callback(new Error('不支持的文件类型'), false);
      }
      callback(null, true);
    },
  }))
  @ApiOperation({ summary: '上传文件' })
  @ApiResponse({ status: 201, description: '上传成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  async uploadFile(
    @Request() req,
    @Body() body: { folder?: string },
    @UploadedFile() file: Express.Multer.File
  ) {
    const folder = body.folder || 'documents';
    return this.ossService.uploadFile(file, folder);
  }

  @Post('images')
  @ApiOperation({ summary: '批量上传图片' })
  @ApiResponse({ status: 201, description: '上传成功' })
  async uploadImages(
    @Body() body: { folder?: string; fileKeys: string[]; files: Express.Multer.File[] }
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('请选择要上传的图片');
    }

    const folder = body.folder || 'images';
    return this.ossService.uploadMultiple(files, folder);
  }

  @Delete('file/:fileKey')
  @ApiOperation({ summary: '删除文件' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '文件不存在' })
  async deleteFile(
    @Param('fileKey') fileKey: string,
  ) {
    await this.ossService.deleteFile(fileKey);
    return { message: '文件删除成功' };
  }
}
