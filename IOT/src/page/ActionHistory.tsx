import {
  CopyOutlined
} from '@ant-design/icons';
import { Button, message, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchHistoryComponent from '../components/SearchHistoryComponent';
import { API_BASE_URL } from '../configuration/App.constant';
import type { PagedModel } from '../types/PagedModel';
import { formatDate } from '../utils/formatDate';

interface DeviceRecord {
  id: string;
  device: string;
  status: string;
  time: string;
}

export default function ActionHistory() {
  const [urlSearchParams] = useSearchParams();
  const [data, setData] = useState<PagedModel<DeviceRecord>>({
    content: [],
    page: {
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0,
    },
  });
  const fetchData = async () => {
    const page = urlSearchParams.get('page') || '1';
    const limit = urlSearchParams.get('limit') || '10';
    const type = urlSearchParams.get('type');
    const sort = urlSearchParams.get('sort');
    const status = urlSearchParams.get('status');
    let url = `${API_BASE_URL}/datahistories?page=${page}&limit=${limit}`;
    if (status) url = `${url}&status=${status}`;
    if (sort) url = `${url}&sort=${sort}`;
    if (type) url = `${url}&type=${type}`;
    const response: PagedModel<DeviceRecord> = await (await fetch(url)).json();
    setData(response);
  };

  useEffect(() => {
    fetchData();
  }, [urlSearchParams]);
  const handleCopy = (text: string) => {
    const date = new Date(text);
    navigator.clipboard.writeText(formatDate(date));
    message.success(`Đã copy: ${formatDate(date)}`);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Thiết bị',
      dataIndex: 'deviceName',
      key: 'device',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: (
        <Space>
          Thời gian
          <Button type="text" size="small" />
        </Space>
      ),
      dataIndex: 'timestamp',
      key: 'time',
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
    <div style={{ padding: 24, height: 'calc(100vh - 112px)' }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Lịch sử bật / tắt thiết bị
      </h1>
      <SearchHistoryComponent totalElements={data.page?.totalElements || 0} />
      <Table
        columns={columns}
        dataSource={data.content}
        rowKey="id"
        bordered
        pagination={false}
      />
    </div>
  );
}
