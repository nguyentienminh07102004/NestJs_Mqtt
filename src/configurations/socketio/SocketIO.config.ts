import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DataSensor } from 'src/modules/datasensors/datasensor.entity';

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

  sendDataToClients(dataSensor: DataSensor) {
    this.server.emit('topic/sendData', dataSensor);
  }
}
