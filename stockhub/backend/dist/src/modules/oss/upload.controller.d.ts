export declare class UploadController {
    uploadImage(): Promise<{
        success: boolean;
        url: string;
    }>;
    uploadFile(): Promise<{
        success: boolean;
        url: string;
    }>;
}
