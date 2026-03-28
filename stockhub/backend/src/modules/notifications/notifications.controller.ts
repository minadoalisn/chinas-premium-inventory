import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('消息通知')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: '发送通知' })
  async sendNotification(@Body() data: { userId: string; message: string }) {
    return this.notificationsService.sendNotification(data.userId, data.message);
  }

  @Get('unread')
  @ApiOperation({ summary: '获取未读通知' })
  async getUnreadNotifications() {
    // 简化实现
    return { count: 0, notifications: [] };
  }
}
