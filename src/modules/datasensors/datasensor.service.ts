import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MqttClient } from 'mqtt';
import { SocketIOService } from 'src/configurations/socketio/SocketIO.config';
import { DataSource, Repository } from 'typeorm';
import { DataSensor } from './datasensor.entity';
import {
  DataSensorQueryDto,
  DataSensorRequestDto,
} from './datasensor.requestdto';

@Injectable()
export class DataSensorService implements OnModuleInit {
  @InjectRepository(DataSensor)
  private readonly dataSensorRepository: Repository<DataSensor>;
  @Inject()
  private readonly dataSource: DataSource;
  @Inject('MQTT_CLIENT')
  private readonly mqttClient: MqttClient;
  @Inject()
  private readonly socketIOService: SocketIOService;
  onModuleInit() {
    this.mqttClient.on('message', async (topic: string, payload: Buffer) => {
      if (topic === 'topic/sendData') {
        const data: DataSensorRequestDto = JSON.parse(payload.toString());
        await this.createDataSensor(data);
        this.socketIOService.sendDataToClients(data);
      }
    });
  }

  async createDataSensor(data: DataSensorRequestDto) {
    const dataSensor = this.dataSensorRepository.create(data);
    return await this.dataSensorRepository.save(dataSensor);
  }

  async getAllDataSensors(query: DataSensorQueryDto) {
    if (!query.page || query.page < 1) query.page = 1;
    if (!query.limit || query.limit < 1) query.limit = 10;
    let startTime: Date | null = null;
    let endTime: Date | null = null;
    if (query.time) {
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(query.time)) {
        startTime = new Date(query.time);
        endTime = new Date(startTime.getTime() + 999);
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(query.time)) {
        startTime = new Date(query.time + ':00');
        endTime = new Date(startTime.getTime() + 59999);
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}$/.test(query.time)) {
        startTime = new Date(query.time + ':00:00');
        endTime = new Date(startTime.getTime() + 3599999);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(query.time)) {
        startTime = new Date(query.time + ' 00:00:00');
        endTime = new Date(startTime.getTime() + 86399999);
      }
    }
    if (!query.sortBy) query.sortBy = 'createdDate';
    if (!query.sort) query.sort = 'DESC';
    // ép kiểu trong postgres
    const res = await this.dataSource.getRepository(DataSensor)
      .createQueryBuilder('ds')
      .where(startTime && endTime ? 'ds."createdDate" BETWEEN :startTime AND :endTime' : '1=1', { startTime, endTime })
      .orderBy(`ds."${query.sortBy}"`, query.sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();
    console.log('res: ', res);
  }
}
