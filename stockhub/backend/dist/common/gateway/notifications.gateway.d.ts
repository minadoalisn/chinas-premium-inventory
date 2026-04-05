import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: any;
    handleConnection(client: any): void;
    handleDisconnect(client: any): void;
}
