import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from 'src/configurations/mqtt/MqttModule.module';
import { SocketIOModule } from 'src/configurations/socketio/SocketIO.module';
import { DataSensorController } from './datasensor.controller';
import { DataSensor } from './datasensor.entity';
import { DataSensorService } from './datasensor.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataSensor]), MqttModule, SocketIOModule],
  controllers: [DataSensorController],
  providers: [DataSensorService],
  exports: [DataSensorService],
})
export class DataSensorModule {}
