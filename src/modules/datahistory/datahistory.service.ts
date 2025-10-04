import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MqttClient } from 'mqtt';
import { DataSource } from 'typeorm';
import { DataHistory } from './datahistory.entity';

@Injectable()
export class DataHistoryService {
  @Inject()
  private readonly dataSource: DataSource;
  @Inject('MQTT_CLIENT')
  private readonly mqttClient: MqttClient;

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
            status = message.toString() as 'ON' | 'OFF';
            const dataHistory = this.dataSource
              .getRepository(DataHistory)
              .create({
                deviceName: device,
                status,
              });
            await this.dataSource.getRepository(DataHistory).save(dataHistory);
            this.mqttClient.unsubscribe(subscribeTopic);
            resolve(dataHistory);
          }
        } catch (err) {
          clearTimeout(timeout);
          this.mqttClient.unsubscribe(subscribeTopic);
          reject(err);
        }
      };
      this.mqttClient.once('message', onMessage);
    });
  }
}
