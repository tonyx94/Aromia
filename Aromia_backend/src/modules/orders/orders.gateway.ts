import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins for development. In production, specify exact origins.
        credentials: true,
    },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(OrdersGateway.name);

    handleConnection(client: any) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    emitOrderCreated(order: any) {
        this.logger.log(`Emitting orderCreated event for order #${order.order_number}`);
        this.server.emit('orderCreated', order);
    }
}
