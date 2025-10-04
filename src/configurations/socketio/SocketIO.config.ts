import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(9092, {
  cors: {
    origin: '*',
  },
})
export class SocketIOService
  implements OnModuleInit, OnGatewayConnection, OnGatewayInit
{
  @WebSocketServer()
  private server: Server;
  
  afterInit(server: any) {
    this.server = server;
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Client connected:', client.id);
  }
  onModuleInit() {
    console.log('SocketIOService initialized');
  }

  sendDataToClients({
    temperature,
    humidity,
    brightness,
  }: {
    temperature: number;
    humidity: number;
    brightness: number;
  }) {
    this.server.emit('topic/sendData', { temperature, humidity, brightness });
  }
}
