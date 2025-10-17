import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MqttClient } from 'mqtt';
import {
  Between,
  DataSource,
  Equal,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { DataHistory } from './datahistory.entity';
import { DataHistoryQueryDto } from './datahistory.requestdto';

@Injectable()
export class DataHistoryService implements OnModuleInit {
  @Inject()
  private readonly dataSource: DataSource;
  @Inject('MQTT_CLIENT')
  private readonly mqttClient: MqttClient;

  onModuleInit() {
    this.mqttClient.on('message', async(topic: string) => {
      if (topic === 'setupDevice') {
        let statusInit = { led: 'OFF', fan: 'OFF', air_conditioner: 'OFF' };
        for (const device of ['led', 'fan', 'air_conditioner']) {
          const dataHistory = await this.dataSource.manager
            .getRepository(DataHistory)
            .createQueryBuilder('dh')
            .select('dh.status')
            .where('dh."deviceName" = :device', { device })
            .orderBy('dh.timestamp', 'DESC')
            .limit(1)
            .getOne();
          if (dataHistory && dataHistory.status) statusInit[device] = dataHistory.status;
          this.mqttClient.publish(`initDevice`, JSON.stringify(statusInit), { qos: 1 });
        }
      }
    });
  }

  async publishAndWait(
    device: 'led' | 'fan' | 'air_conditioner',
    status: 'ON' | 'OFF' | 'on' | 'off',
  ): Promise<DataHistory> {
    return new Promise((resolve, reject) => {
      status = status.toUpperCase() as 'ON' | 'OFF';
      const requestId = randomUUID();
      this.mqttClient.publish(
        `esp32/${device}`,
        JSON.stringify({ status: status.toLowerCase(), requestId }),
        { qos: 1 },
      );
      const timeout = setTimeout(() => {
        this.mqttClient.removeAllListeners('message');
        reject(new Error('Device not response'));
      }, 5000);
      const onMessage = async (topic: string, message: Buffer) => {
        try {
          if (topic === 'control-device') {
            clearTimeout(timeout);
            const statusDevice = status;
            const dataHistory = this.dataSource
              .getRepository(DataHistory)
              .create({
                deviceName: device,
                status: statusDevice as 'ON' | 'OFF',
              });
            await this.dataSource.getRepository(DataHistory).save(dataHistory);
            this.mqttClient.removeListener('message', onMessage);
            resolve(dataHistory);
          }
        } catch (err) {
          clearTimeout(timeout);
          this.mqttClient.removeListener('message', onMessage);
          reject(err);
        }
      };
      this.mqttClient.on('message', onMessage);
    });
  }

  async getDataHistory(query: DataHistoryQueryDto) {
    if (!query.page || query.page < 1) query.page = 1;
    if (!query.limit || query.limit < 1) query.limit = 10;
    let startTime: Date | null = null;
    let endTime: Date | null = null;
    if (query.type === 'timestamp' && query.status) {
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(query.status)) {
        startTime = new Date(query.status);
        endTime = new Date(startTime.getTime() + 999);
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(query.status)) {
        startTime = new Date(query.status + ':00');
        endTime = new Date(startTime.getTime() + 59999);
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}$/.test(query.status)) {
        startTime = new Date(query.status + ':00:00');
        endTime = new Date(startTime.getTime() + 3599999);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(query.status)) {
        startTime = new Date(query.status + ' 00:00:00');
        endTime = new Date(startTime.getTime() + 86399999);
      }
    }
    console.log({ startTime, endTime });
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
      filter['deviceName'] = Equal(query.type);
      if (query.status && (query.status.toUpperCase() as 'ON' | 'OFF')) {
        filter['status'] = Equal(query.status.toUpperCase());
      }
    } else if (!query.type) {
      if (query.status) {
        filter['status'] = Equal(query.status.toUpperCase());
      }
    }
    const [data, totalElements] = await this.dataSource
      .getRepository(DataHistory)
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
