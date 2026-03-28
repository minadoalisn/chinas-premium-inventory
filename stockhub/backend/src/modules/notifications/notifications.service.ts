import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendNotification(userId: string, message: string) {
    // 简化实现：暂时不发送实际通知
    console.log(`Notification for user ${userId}: ${message}`);
    return { success: true };
  }
}
