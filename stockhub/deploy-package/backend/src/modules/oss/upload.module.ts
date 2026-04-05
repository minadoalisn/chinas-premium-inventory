import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { OssService } from './oss.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 10485760, // 10MB
      },
    }),
  ],
  controllers: [UploadController],
  providers: [OssService],
  exports: [OssService],
})
export class UploadModule {}
