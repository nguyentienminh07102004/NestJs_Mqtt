import {
  CopyOutlined
} from '@ant-design/icons';
import { message, Space, Table, Tooltip } from 'antd';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchSensorComponent from '../components/SearchSensorComponent';
import { API_BASE_URL } from '../configuration/App.constant';
import type { PagedModel } from '../types/PagedModel';

type SensorData = {
  id: string;
  temperature: string;
  humidity: string;
  light: string;
  time: string;
};

export default function Sensor() {
  const [urlSearchParams] = useSearchParams();
  const [data, setData] = React.useState<PagedModel<SensorData>>({
    content: [],
    page: { totalElements: 0, totalPages: 0, number: 1, size: 10 },
  });
  const fetchData = async () => {
    const page = urlSearchParams.get('page') || '1';
    const limit = urlSearchParams.get('limit') || '10';
    const type = urlSearchParams.get('type');
    const sort = urlSearchParams.get('sort');
    const value = urlSearchParams.get('value');
    let url = `${API_BASE_URL}/datasensors?page=${page}&limit=${limit}`;
    if (value) url = `${url}&value=${value}`;
    if (sort) url = `${url}&sort=${sort}`;
    if (type) url = `${url}&type=${type}`;
    const response: PagedModel<SensorData> = await (await fetch(url)).json();
    setData(response);
  };
  React.useEffect(() => {
    fetchData();
  }, [urlSearchParams]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã copy: ${text}`);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Nhiệt độ
        </div>
      ),
      dataIndex: 'temperature',
      key: 'temperature',
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Độ ẩm
        </div>
      ),
      dataIndex: 'humidity',
      key: 'humidity',
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Ánh sáng
        </div>
      ),
      dataIndex: 'brightness',
      key: 'brightness',
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Thời gian
        </div>
      ),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => (
        <Space>
          <span>{text}</span>
          <Tooltip title="Copy thời gian">
            <CopyOutlined
              onClick={() => handleCopy(text)}
              style={{ cursor: 'pointer', color: '#1677ff' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Lịch sử cảm biến
      </h1>
      <SearchSensorComponent totalElements={data.page.totalElements || 0} />
      <Table pagination={false} columns={columns} dataSource={data.content} rowKey="id" bordered />
    </div>
  );
}
