import { Module } from '@nestjs/common';
import { PostgresConfiguration } from './configurations/database.config';
import { MqttService } from './configurations/mqtt.config';
import { DataSensorModule } from './modules/datasensors/datasensor.module';

@Module({
  imports: [PostgresConfiguration, DataSensorModule],
  controllers: [],
  providers: [MqttService],
})
export class AppModule {}
