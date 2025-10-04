import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(9092, {
  cors: {
    origin: '*',
  },
})
export class SocketIOService implements OnModuleInit, OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Client connected:', client.id);
  }
  onModuleInit() {
    console.log('SocketIOService initialized');
  }
}
