import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendNotification(data: {
        userId: string;
        message: string;
    }): unknown;
    getUnreadNotifications(): unknown;
}
