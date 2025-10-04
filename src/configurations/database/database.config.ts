import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataHistory } from 'src/modules/datahistory/datahistory.entity';
import { DataSensor } from 'src/modules/datasensors/datasensor.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'MQTT',
      entities: [DataSensor, DataHistory],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class PostgresConfiguration {}
