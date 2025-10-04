import { connect, MqttClient } from 'mqtt';
export const MqttProvider = {
  provide: 'MQTT_CLIENT',
  useFactory: () => {
    const host = 'localhost';
    const port = 1883;
    const clientId = 'esp32-mqtt-client-js';
    const qos = 1;

    const connectUrl = `mqtt://${host}:${port}`;

    const mqttClient: MqttClient = connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: 'user1',
      password: '123',
      reconnectPeriod: 1000,
    });

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe('topic/sendData', { qos });
      mqttClient.subscribe('control-device', { qos });
    });

    mqttClient.on('message', (topic: string, payload: Buffer) => {
      if (topic === 'topic/sendData') {
        console.log('Received Message:', topic, payload.toString());
      }
    });

    return mqttClient;
  },
};
