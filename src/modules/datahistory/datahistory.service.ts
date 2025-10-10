import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MqttClient } from 'mqtt';
import { DataSource } from 'typeorm';
import { DataHistory } from './datahistory.entity';

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
      const subscribeTopic = `control-device/${requestId}`;
      this.mqttClient.subscribe(subscribeTopic, { qos: 1 });
      this.mqttClient.publish(
        `esp32/${device}`,
        JSON.stringify({ status, requestId }),
        { qos: 1 },
      );
      const timeout = setTimeout(() => {
        this.mqttClient.unsubscribe(subscribeTopic);
        reject(new Error('Device not response'));
      }, 5000);
      const onMessage = async (topic: string, message: Buffer) => {
        try {
          if (topic === subscribeTopic) {
            clearTimeout(timeout);
            const dataHistory = this.dataSource
              .getRepository(DataHistory)
              .create({
                deviceName: device,
                status: message.toString().toUpperCase() as 'ON' | 'OFF',
              });
            await this.dataSource.getRepository(DataHistory).save(dataHistory);
            this.mqttClient.unsubscribe(subscribeTopic);
            this.mqttClient.removeListener('message', onMessage);
            resolve(dataHistory);
          }
        } catch (err) {
          clearTimeout(timeout);
          this.mqttClient.unsubscribe(subscribeTopic);
          this.mqttClient.removeListener('message', onMessage);
          reject(err);
        }
      };
      this.mqttClient.on('message', onMessage);
    });
  }
}
