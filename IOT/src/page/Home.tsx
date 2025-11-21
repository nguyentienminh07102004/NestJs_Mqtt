import { Card, Row, Col, Switch, Tag } from 'antd';
import { useEffect, useState } from 'react';
import {
  Thermometer,
  Droplets,
  Sun,
  Fan,
  Lightbulb,
  AirVent,
  Rainbow,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import SocketIOConfiguration from '../configuration/SocketIOConfiguration';

type Sensor = {
  id: number;
  temperature: number;
  humidity: number;
  brightness: number;
  timestamp: string;
  rain: number;
  windSpeed: number;
  pressure: number;
};
type DeviceState = {
  fan: boolean;
  air_conditioner: boolean;
  led: boolean;
};
export default function Home() {
  const [data, setData] = useState<Sensor[]>([]);
  const [deviceState, setDeviceState] = useState<DeviceState>({
    fan: false,
    air_conditioner: false,
    led: false,
  });
  const io = SocketIOConfiguration;

  const getStatusColor = (type: string, value: number) => {
    if (type === 'temperature') {
      if (value < 20) return 'blue';
      if (value > 35) return 'red';
    } else if (type === 'humidity') {
      if (value < 40) return 'orange';
      if (value > 80) return 'blue';
    } else if (type === 'brightness') {
      if (value < 200) return 'gray';
      if (value > 600) return 'yellow';
    } else if (type === 'rain') {
      if (value == 0) return 'green';
      if (value < 500) return 'blue';
      return 'red';
    } else if (type === 'windSpeed') {
      if (value < 100) return 'green';
      if (value < 500) return 'blue';
      return 'red';
    } else if (type === 'pressure') {
      if (value < 100) return 'blue';
      if (value < 500) return 'orange';
      return 'red';
    }
    return 'green';
  };
  useEffect(() => {
    io.connect();
    io.on('topic/sendData', (newData: Sensor) => {
      setData((prev) => [...prev.slice(-9), newData]);
    });
  }, [io]);
  const latest = data.length
    ? data[data.length - 1]
    : {
        temperature: 0,
        humidity: 0,
        brightness: 0,
        id: 0,
        rain: 0,
        windSpeed: 0,
        pressure: 0,
        timestamp: '',
      };
  const keyframes = `
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity: 0.8; } 50% { opacity: 1; } }
  `;

  return (
    <div
      style={{
        height: '100%', // full trong Content
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        background: '#f5f6fa',
        overflow: 'hidden', // tránh scroll
      }}
    >
      <style>{keyframes}</style>

      <Row gutter={24} style={{ flexShrink: 0 }}>
        {[
          {
            label: 'Nhiệt độ',
            value: latest.temperature,
            icon: (
              <Thermometer
                color={getStatusColor('temperature', latest.temperature)}
                size={28}
              />
            ),
            unit: '°C',
            color: getStatusColor('temperature', latest.temperature),
            status:
              latest.temperature < 20
                ? 'Thấp'
                : latest.temperature > 35
                  ? 'Cao'
                  : 'Bình thường',
          },
          {
            label: 'Độ ẩm',
            value: latest.humidity,
            icon: (
              <Droplets
                color={getStatusColor('humidity', latest.humidity)}
                size={28}
              />
            ),
            unit: '%',
            color: getStatusColor('humidity', latest.humidity),
            status:
              latest.humidity < 40
                ? 'Thấp'
                : latest.humidity > 80
                  ? 'Cao'
                  : 'Bình thường',
          },
          {
            label: 'Ánh sáng',
            value: latest.brightness,
            icon: (
              <Sun
                color={getStatusColor('brightness', latest.brightness)}
                size={28}
              />
            ),
            unit: 'Lux',
            color: getStatusColor('brightness', latest.brightness),
            status:
              latest.brightness < 200
                ? 'Tối'
                : latest.brightness > 600
                  ? 'Chói'
                  : 'Bình thường',
          },
          {
            label: 'Mưa',
            value: latest.rain,
            icon: (
              <Rainbow
                color={getStatusColor('rain', latest.rain)}
                size={28}
              />
            ),
            unit: 'mm',
            color: getStatusColor('rain', latest.rain),
            status:
              latest.rain == 0
                ? 'Không mưa'
                : latest.rain < 500
                  ? 'Bình thường'
                  : 'Mưa to',
          },
          {
            label: 'Gió',
            value: latest.windSpeed,
            icon: (
              <AirVent
                color={getStatusColor('windSpeed', latest.windSpeed)}
                size={28}
              />
            ),
            unit: 'm/s',
            color: getStatusColor('windSpeed', latest.windSpeed),
            status:
              latest.windSpeed < 100
                ? 'Yếu'
                : latest.windSpeed < 500
                  ? 'Thường'
                  : 'Mạnh',
          },
          {
            label: 'Áp suất',
            value: latest.pressure,
            icon: (
              <Fan
                color={getStatusColor('pressure', latest.pressure)}
                size={28}
              />
            ),
            unit: 'pa',
            color: getStatusColor('pressure', latest.pressure),
            status:
              latest.pressure < 100
                ? 'Thấp'
                : latest.pressure < 500
                  ? 'Trung bình'
                  : 'Cao',
          }
        ].map((item, index) => (
          <Col span={8} key={index}>
            <Card>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.icon}
                  <div>
                    <p style={{ margin: 0 }}>{item.label}</p>
                    <h2 style={{ fontSize: 28, margin: 0 }}>
                      {item.value.toFixed(1)} {item.unit}
                    </h2>
                  </div>
                </div>
                <Tag color={item.color}>{item.status}</Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={24} style={{ flex: 1, minHeight: 0 }}>
        <Col span={16} style={{ height: '100%' }}>
          <Card
            title="Biểu đồ dữ liệu cảm biến (10 lần gần nhất)"
            style={{ height: '100%' }}
            bodyStyle={{ height: 'calc(100% - 48px)' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f5222d"
                  name="Nhiệt độ (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#1890ff"
                  name="Độ ẩm (%)"
                />
                <Line
                  type="monotone"
                  dataKey="brightness"
                  stroke="#fadb14"
                  name="Ánh sáng (Lux)"
                />
                <Line
                  type="monotone"
                  dataKey="rain"
                  stroke="#5F9EA0"
                  name="Mưa (mm)"
                />
                <Line
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#5F9EA0"
                  name="Tốc độ gió (m/s)"
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#2F4F4F"
                  name="Áp suất (pa)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={8} style={{ height: '100%' }}>
          <Card title="Điều khiển thiết bị" style={{ height: '100%' }}>
            {[
              {
                key: 'fan',
                name: 'Quạt',
                icon: (
                  <Fan
                    size={26}
                    color={deviceState.fan ? '#52c41a' : '#999'}
                    style={
                      deviceState.fan
                        ? { animation: 'spin 1s linear infinite' }
                        : {}
                    }
                  />
                ),
              },
              {
                key: 'air_conditioner',
                name: 'Điều hòa',
                icon: (
                  <AirVent
                    size={26}
                    color={deviceState.air_conditioner ? '#1890ff' : '#999'}
                    style={
                      deviceState.air_conditioner
                        ? { animation: 'pulse 1.5s infinite' }
                        : {}
                    }
                  />
                ),
              },
              {
                key: 'led',
                name: 'Đèn',
                icon: (
                  <Lightbulb
                    size={26}
                    color={deviceState.led ? '#faad14' : '#999'}
                    style={
                      deviceState.led
                        ? { filter: 'drop-shadow(0 0 6px #ffd666)' }
                        : {}
                    }
                  />
                ),
              },
            ].map((device) => (
              <div
                key={device.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  marginBottom: 16,
                  borderRadius: 12,
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontWeight: 500,
                  }}
                >
                  {device.icon}
                  <span>{device.name}</span>
                </div>
                <Switch
                  checked={deviceState[device.key as keyof DeviceState]}
                  onChange={(checked) => {
                    fetch(
                      `http://localhost:3000/api/v1/datahistories/${device.key}/${checked ? 'ON' : 'OFF'}`,
                      {
                        method: 'POST',
                      },
                    ).then((response) => {
                      if (!response.ok) return;
                      setDeviceState((prev) => ({
                        ...prev,
                        [device.key]: checked,
                      }));
                    });
                  }}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
