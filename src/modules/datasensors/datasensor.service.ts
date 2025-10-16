import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MqttClient } from 'mqtt';
import { SocketIOService } from 'src/configurations/socketio/SocketIO.config';
import {
  Between,
  DataSource,
  Equal,
  LessThanOrEqual,
  MoreThanOrEqual,
  Or,
  Repository,
} from 'typeorm';
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
    if (!query.sort) query.sort = 'timestamp-DESC';
    const [sortBy, sortOrder] = query.sort.split('-');
    let filter = {};
    if (startTime || endTime) {
      if (startTime && endTime) {
        filter['timestamp'] = Between(startTime, endTime);
      } else if (startTime) {
        filter['timestamp'] = MoreThanOrEqual(startTime);
      } else if (endTime) {
        filter['timestamp'] = LessThanOrEqual(endTime);
      }
    }
    if (query.type && query.type !== 'timestamp') {
      if (query.value) {
        filter[query.type] = Equal(Number(query.value));
      }
    } else if (!query.type) {
      if (query.value) {
        filter = [
          { ...filter, temperature: query.value },
          { ...filter, humidity: query.value },
          { ...filter, brightness: query.value },
        ];
      }
    }
    const [data, totalElements] = await this.dataSource
      .getRepository(DataSensor)
      .findAndCount({
        where: filter,
        order: {
          [sortBy]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      });
    return {
      content: data,
      page: {
        totalElements,
        totalPages: Math.ceil(totalElements / query.limit),
        number: query.page,
        size: query.limit,
      },
    };
  }
}
