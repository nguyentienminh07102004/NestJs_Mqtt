import { Module } from '@nestjs/common';
import { SocketIOService } from './SocketIO.config';

@Module({
  providers: [SocketIOService],
})
export class SocketIOModule {}
