import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class OssService {
  private readonly endpoint: string;
  private readonly accessKeyId: string;
  private readonly accessKeySecret: string;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get('OSS_ENDPOINT');
    this.accessKeyId = this.configService.get('OSS_ACCESS_KEY_ID');
    this.accessKeySecret = this.configService.get('OSS_ACCESS_KEY_SECRET');
    this.bucketName = this.configService.get('OSS_BUCKET_NAME');
    this.region = this.configService.get('OSS_REGION', 'oss-cn-hangzhou');
  }

  /**
   * 生成OSS签名
   */
  private generateSignature(
    method: string,
    contentMd5: string,
    contentType: string,
    date: string,
    resource: string
  ): string {
    const stringToSign = `${method}\n${contentType}\n${date}\n${resource}`;
    const signature = crypto
      .createHmac('sha1', this.accessKeySecret)
      .update(stringToSign)
      .digest('base64');

    return signature;
  }

  /**
   * 上传文件到OSS
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<{ url: string; fileName: string; fileKey: string; fileSize: number }> {
    const fileName = `${folder}/${uuidv4()}${file.originalname.split('.').pop()}`;
    const fileKey = fileName;

    const contentType = file.mimetype || 'application/octet-stream';

    // 计算MD5
    const contentMd5 = crypto.createHash('md5').update(file.buffer).digest('hex');

    const date = new Date().toUTCString();
    const resource = `/${this.bucketName}/${fileKey}`;

    // 生成签名
    const signature = this.generateSignature(
      'PUT',
      contentMd5,
      contentType,
      date,
      resource
    );

    // 构造Authorization头
    const authorization = `OSS ${this.accessKeyId}:${signature}`;

    // 上传文件
    const url = `https://${this.bucketName}.${this.endpoint}/${fileKey}`;

    const response = await axios.put(url, file.buffer, {
      headers: {
        'Authorization': authorization,
        'Content-Type': contentType,
        'Content-MD5': contentMd5,
        'Date': date,
        'Host': `${this.bucketName}.${this.endpoint}`,
        'x-oss-object-acl': 'public-read',
      },
      maxBodyLength: 100 * 1024 * 1024, // 100MB
    });

    if (response.status !== 200) {
      throw new BadRequestException(`文件上传失败: ${response.statusText}`);
    }

    // 返回文件访问URL
    return {
      url: `https://${this.bucketName}.${this.endpoint}/${fileKey}`,
      fileName: file.originalname,
      fileKey,
      fileSize: file.size,
    };
  }

  /**
   * 删除文件
   */
  async deleteFile(fileKey: string): Promise<void> {
    const date = new Date().toUTCString();
    const resource = `/${this.bucketName}/${fileKey}`;
    const signature = this.generateSignature(
      'DELETE',
      '',
      '',
      date,
      resource
    );

    const authorization = `OSS ${this.accessKeyId}:${signature}`;

    const url = `https://${this.bucketName}.${this.endpoint}/${fileKey}`;

    await axios.delete(url, {
      headers: {
        'Authorization': authorization,
        'Date': date,
        'Host': `${this.bucketName}.${this.endpoint}`,
      },
    });
  }

  /**
   * 获取文件访问URL
   */
  getPublicUrl(fileKey: string): string {
    return `https://${this.bucketName}.${this.endpoint}/${fileKey}`;
  }

  /**
   * 批量上传
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string = 'uploads'
  ): Promise<Array<{ url: string; fileName: string; fileKey: string; fileSize: number }>> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }
}
