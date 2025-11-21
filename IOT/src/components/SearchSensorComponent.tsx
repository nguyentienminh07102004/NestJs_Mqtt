import { Input, Pagination, Select, Space } from 'antd';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchSensorComponent({
  totalElements,
}: {
  totalElements: number;
}) {
  type Type = 'temperature' | 'humidity' | 'brightness' | 'timestamp' | '';
  type Sort =
    | 'timestamp-ASC'
    | 'timestamp-DESC'
    | 'temperature-ASC'
    | 'temperature-DESC'
    | 'humidity-ASC'
    | 'humidity-DESC'
    | 'brightness-ASC'
    | 'brightness-DESC'
    | 'rain-ASC'
    | 'rain-DESC'
    | 'windSpeed-ASC'
    | 'windSpeed-DESC'
    | 'pressure-ASC'
    | 'pressure-DESC';
  const [type, setType] = React.useState<Type>('');
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [sort, setSort] = React.useState<Sort>('timestamp-ASC');
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  React.useEffect(() => {
    const type = urlSearchParams.get('type');
    if (sort) setSort(sort as Sort);
    else setSort('timestamp-ASC');
    if (type) setType(type as Type);
  }, []);
  React.useEffect(() => {
    if (type) urlSearchParams.set('type', type);
    else urlSearchParams.delete('type');
    if (sort) urlSearchParams.set('sort', sort);
    else urlSearchParams.delete('sort');
    setUrlSearchParams(urlSearchParams);
  }, [type, sort]);
  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          value={type}
          onChange={setType}
          style={{ width: 180 }}
          options={[
            { value: '', label: 'Tất cả' },
            { value: 'temperature', label: 'Nhiệt độ' },
            { value: 'humidity', label: 'Độ ẩm' },
            { value: 'brightness', label: 'Ánh sáng' },
            { value: 'rain', label: 'Mưa' },
            { value: 'windSpeed', label: 'Tốc độ gió' },
            { value: 'pressure', label: 'Áp suất' },
            { value: 'timestamp', label: 'Thời gian' },
          ]}
        />

        <Input
          placeholder="Nhập từ khóa tìm kiếm..."
          style={{ width: 260 }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              urlSearchParams.set('value', e.currentTarget.value);
              setUrlSearchParams(urlSearchParams);
            }
          }}
        />

        <Pagination
          showSizeChanger
          total={totalElements}
          current={page}
          pageSize={limit}
          onChange={(page, pageSize) => {
            if (pageSize) setLimit(pageSize);
            if (page) setPage(page);
            urlSearchParams.set('page', page.toString());
            urlSearchParams.set('limit', pageSize.toString());
            setUrlSearchParams(urlSearchParams);
          }}
        />

        <Select
          value={sort}
          onChange={setSort}
          style={{ width: 180 }}
          options={[
            { value: 'timestamp-ASC', label: 'Thời gian (Tăng dần)' },
            { value: 'timestamp-DESC', label: 'Thời gian (Giảm dần)' },
            { value: 'temperature-ASC', label: 'Nhiệt độ (Tăng dần)' },
            { value: 'temperature-DESC', label: 'Nhiệt độ (Giảm dần)' },
            { value: 'humidity-ASC', label: 'Độ ẩm (Tăng dần)' },
            { value: 'humidity-DESC', label: 'Độ ẩm (Giảm dần)' },
            { value: 'brightness-ASC', label: 'Ánh sáng (Tăng dần)' },
            { value: 'brightness-DESC', label: 'Ánh sáng (Giảm dần)' },
          ]}
        />
      </Space>
    </>
  );
}
