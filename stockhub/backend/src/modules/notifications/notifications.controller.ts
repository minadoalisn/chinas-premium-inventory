import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('通知服务')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('test')
  @ApiOperation({ summary: '测试通知' })
  @ApiResponse({ status: 200, description: '通知发送成功' })
  async testNotification(@Request() req) {
    this.notificationsService.broadcastNotification('DEMAND_MATCHED', {
      message: '这是一条测试通知',
    });
    return { message: '通知已发送' };
  }
}
