import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from '../common/gateway/notifications.gateway';
import { MessageType } from '../common/gateway/notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * 发送求购匹配通知
   */
  async sendDemandMatchNotification(
    userId: string,
    demandTitle: string,
    matchedProductCount: number
  ) {
    this.notificationsGateway.sendToUser(
      userId,
      MessageType.DEMAND_MATCHED,
      {
        demandTitle,
        matchedProductCount,
        message: `您的求购"${demandTitle}"已匹配到${matchedProductCount}个商品`,
      }
    );
  }

  /**
   * 发送求购状态更新通知
   */
  async sendDemandStatusNotification(
    userId: string,
    demandId: string,
    status: string,
    statusText: string
  ) {
    this.notificationsGateway.sendToUser(
      userId,
      MessageType.DEMAND_UPDATED,
      {
        demandId,
        status,
        statusText,
        message: `求购状态更新：${statusText}`,
      }
    );
  }

  /**
   * 发送订单创建通知
   */
  async sendOrderCreatedNotification(
    userId: string,
    orderId: string,
    orderNo: string
  ) {
    this.notificationsGateway.sendToUser(
      userId,
      MessageType.ORDER_CREATED,
      {
        orderId,
        orderNo,
        message: `订单创建成功，订单号：${orderNo}`,
      }
    );
  }

  /**
   * 发送订单状态更新通知
   */
  async sendOrderStatusNotification(
    userId: string,
    orderId: string,
    status: string,
    statusText: string
  ) {
    this.notificationsGateway.sendToUser(
      userId,
      MessageType.ORDER_UPDATED,
      {
        orderId,
        status,
        statusText,
        message: `订单状态更新：${statusText}`,
      }
    );
  }

  /**
   * 发送询盘回复通知
   */
  async sendInquiryReplyNotification(
    userId: string,
    inquiryId: string,
    replyContent: string
  ) {
    this.notificationsGateway.sendToUser(
      userId,
      MessageType.INQUIRY_REPLY,
      {
        inquiryId,
        replyContent,
        message: `收到新的询盘回复`,
      }
    );
  }

  /**
   * 广播系统通知
   */
  async broadcastNotification(type: MessageType, data: any) {
    this.notificationsGateway.broadcast(type, data);
  }
}
