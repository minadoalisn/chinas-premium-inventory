export declare class NotificationsService {
    sendNotification(userId: string, message: string): Promise<{
        success: boolean;
    }>;
}
