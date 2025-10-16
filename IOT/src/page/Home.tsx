import { Card, Row, Col, Switch, Tag } from "antd";
import { useEffect, useState } from "react";
import {
  Thermometer,
  Droplets,
  Sun,
  Fan,
  Lightbulb,
  AirVent,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Sensor = {
  id: number;
  temperature: number;
  humidity: number;
  light: number;
  time: string;
};

export default function Home() {
  const [data, setData] = useState<Sensor[]>([]);
  const [deviceState, setDeviceState] = useState({
    fan: false,
    air: false,
    light: false,
  });

  const getStatusColor = (type: string, value: number) => {
    if (type === "temperature") {
      if (value < 20) return "blue";
      if (value > 35) return "red";
      return "green";
    } else if (type === "humidity") {
      if (value < 40) return "orange";
      if (value > 80) return "blue";
      return "green";
    } else if (type === "light") {
      if (value < 200) return "gray";
      if (value > 600) return "yellow";
      return "green";
    }
  };

  // fake ra 10 data ban đầu
  useEffect(() => {
    const initData: Sensor[] = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      temperature: 25 + Math.random() * 10,
      humidity: 50 + Math.random() * 30,
      light: 200 + Math.random() * 500,
      time: `${9 + Math.floor(i / 2)}:${(i % 2) * 30 === 0 ? "00" : "30"}`,
    }));
    setData(initData);
  }, []);

  // realtime update mỗi 3s
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newData: Sensor = {
        id: now.getTime(),
        temperature: 25 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        light: 200 + Math.random() * 500,
        time: now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setData((prev) => [...prev.slice(-9), newData]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return null;
  const latest = data[data.length - 1];

  // Animation inline
  const keyframes = `
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity: 0.8; } 50% { opacity: 1; } }
  `;

  return (
    <div
      style={{
        height: "100%", // full trong Content
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        background: "#f5f6fa",
        overflow: "hidden", // tránh scroll
      }}
    >
      <style>{keyframes}</style>

      {/* Hàng 1: 3 ô realtime */}
      <Row gutter={24} style={{ flexShrink: 0 }}>
        {[
          {
            label: "Nhiệt độ",
            value: latest.temperature,
            icon: (
              <Thermometer
                color={getStatusColor("temperature", latest.temperature)}
                size={28}
              />
            ),
            unit: "°C",
            color: getStatusColor("temperature", latest.temperature),
            status:
              latest.temperature < 20
                ? "Thấp"
                : latest.temperature > 35
                ? "Cao"
                : "Bình thường",
          },
          {
            label: "Độ ẩm",
            value: latest.humidity,
            icon: (
              <Droplets
                color={getStatusColor("humidity", latest.humidity)}
                size={28}
              />
            ),
            unit: "%",
            color: getStatusColor("humidity", latest.humidity),
            status:
              latest.humidity < 40
                ? "Thấp"
                : latest.humidity > 80
                ? "Cao"
                : "Bình thường",
          },
          {
            label: "Ánh sáng",
            value: latest.light,
            icon: (
              <Sun color={getStatusColor("light", latest.light)} size={28} />
            ),
            unit: "Lux",
            color: getStatusColor("light", latest.light),
            status:
              latest.light < 200
                ? "Tối"
                : latest.light > 600
                ? "Chói"
                : "Bình thường",
          },
        ].map((item, index) => (
          <Col span={8} key={index}>
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

      {/* Hàng 2: Biểu đồ + Điều khiển */}
      <Row gutter={24} style={{ flex: 1, minHeight: 0 }}>
        <Col span={16} style={{ height: "100%" }}>
          <Card
            title="Biểu đồ dữ liệu cảm biến (10 lần gần nhất)"
            style={{ height: "100%" }}
            bodyStyle={{ height: "calc(100% - 48px)" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
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
                  dataKey="light"
                  stroke="#fadb14"
                  name="Ánh sáng (Lux)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={8} style={{ height: "100%" }}>
          <Card title="Điều khiển thiết bị" style={{ height: "100%" }}>
            {[
              {
                key: "fan",
                name: "Quạt",
                icon: (
                  <Fan
                    size={26}
                    color={deviceState.fan ? "#52c41a" : "#999"}
                    style={
                      deviceState.fan
                        ? { animation: "spin 1s linear infinite" }
                        : {}
                    }
                  />
                ),
              },
              {
                key: "air",
                name: "Điều hòa",
                icon: (
                  <AirVent
                    size={26}
                    color={deviceState.air ? "#1890ff" : "#999"}
                    style={
                      deviceState.air
                        ? { animation: "pulse 1.5s infinite" }
                        : {}
                    }
                  />
                ),
              },
              {
                key: "light",
                name: "Đèn",
                icon: (
                  <Lightbulb
                    size={26}
                    color={deviceState.light ? "#faad14" : "#999"}
                    style={
                      deviceState.light
                        ? { filter: "drop-shadow(0 0 6px #ffd666)" }
                        : {}
                    }
                  />
                ),
              },
            ].map((device) => (
              <div
                key={device.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  marginBottom: 16,
                  borderRadius: 12,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontWeight: 500,
                  }}
                >
                  {device.icon}
                  <span>{device.name}</span>
                </div>
                <Switch
                  checked={(deviceState as any)[device.key]}
                  onChange={(checked) =>
                    setDeviceState((prev) => ({
                      ...prev,
                      [device.key]: checked,
                    }))
                  }
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
