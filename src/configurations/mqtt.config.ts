import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { connect } from 'mqtt';
import { DataSensorService } from 'src/modules/datasensors/datasensor.service';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient;
  @Inject()
  private readonly dataSensorService: DataSensorService;

  onModuleInit() {
    const host = 'localhost';
    const port = 1883;
    const clientId = 'esp32-mqtt-client-js';

    const connectUrl = `mqtt://${host}:${port}`;

    this.mqttClient = connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: 'user1',
      password: '123',
      reconnectPeriod: 1000,
    });

    this.mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.mqttClient.subscribe('topic/sendData', { qos: 1 });
    });
    this.mqttClient.on('message', (topic, message) => {
      if (topic === 'topic/sendData') {
        this.dataSensorService.createDataSensor(JSON.parse(message.toString()));
      }
    });
  }
}
