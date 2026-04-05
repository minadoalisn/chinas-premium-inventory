import { ConfigService } from '@nestjs/config';
export declare class OssService {
    private configService;
    constructor(configService: ConfigService);
    uploadFile(file: any, folder?: string): Promise<{
        url: string;
        fileName: any;
        fileKey: string;
        fileSize: any;
    }>;
    deleteFile(fileKey: string): Promise<{
        success: boolean;
    }>;
    getFileUrl(fileKey: string): string;
}
