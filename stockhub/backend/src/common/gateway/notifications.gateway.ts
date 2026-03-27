import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

// 消息类型
export enum MessageType {
  DEMAND_MATCHED = 'DEMAND_MATCHED', // 求购匹配到商品
  DEMAND_UPDATED = 'DEMAND_UPDATED', // 求购状态更新
  ORDER_CREATED = 'ORDER_CREATED', // 订单创建
  ORDER_UPDATED = 'ORDER_UPDATED', // 订单状态更新
  INQUIRY_REPLY = 'INQUIRY_REPLY', // 询盘回复
}

// WebSocket消息结构
interface WsMessage {
  type: MessageType;
  userId: string;
  data: any;
  timestamp: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway {
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    @WebSocketServer() server: WebSocketServer,
  ) {
    server.on('connection', (socket: ConnectedSocket) => {
      this.logger.log(`用户连接: ${socket.id}`);
    });
  }

  // 向特定用户发送消息
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: WsMessage) {
    this.logger.log(`发送消息给用户 ${data.userId}: ${data.type}`);
    // 这里可以存储用户的 socket ID，通过 userId 查找 socket
  }

  // 广播消息给所有用户
  @SubscribeMessage('broadcast')
  handleBroadcast(@MessageBody() data: WsMessage) {
    this.server.emit('message', data);
    this.logger.log(`广播消息: ${data.type}`);
  }

  // 向特定用户发送个人消息
  sendToUser(userId: string, type: MessageType, data: any) {
    this.server.emit('message', {
      type,
      userId,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // 广播消息
  broadcast(type: MessageType, data: any) {
    this.server.emit('message', {
      type,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}
