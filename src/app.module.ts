import { Module } from '@nestjs/common';
import { PostgresConfiguration } from './configurations/database/database.config';
import { DataHistoryModule } from './modules/datahistory/datahistory.module';
import { DataSensorModule } from './modules/datasensors/datasensor.module';
import { SocketIOModule } from './configurations/socketio/SocketIO.module';
import { MqttModule } from './configurations/mqtt/MqttModule.module';

@Module({
  imports: [
    PostgresConfiguration,
    DataSensorModule,
    DataHistoryModule,
    SocketIOModule,
    MqttModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
