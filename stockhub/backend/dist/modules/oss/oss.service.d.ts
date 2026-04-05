import { ConfigService } from '@nestjs/config';
export declare class OssService {
    private configService;
    constructor(configService: ConfigService);
    uploadFile(file: any, folder?: string): unknown;
    deleteFile(fileKey: string): unknown;
    getFileUrl(fileKey: string): string;
}
