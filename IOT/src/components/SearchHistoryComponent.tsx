import { Input, Pagination, Select, Space } from 'antd';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchHistoryComponent({
  totalElements,
}: {
  totalElements: number;
}) {
  type Type = 'timestamp' | 'fan' | 'led' | 'air_conditioner' | '';
  type Sort =
    | 'timestamp-ASC'
    | 'timestamp-DESC';
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
            { value: 'fan', label: 'Quạt' },
            { value: 'led', label: 'Đèn LED' },
            { value: 'air_conditioner', label: 'Điều hòa' },
            { value: 'timestamp', label: 'Thời gian' },
          ]}
        />

        <Input
          placeholder="Nhập từ khóa tìm kiếm..."
          style={{ width: 260 }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                urlSearchParams.set('status', e.currentTarget.value);
                setUrlSearchParams(urlSearchParams)
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
          ]}
        />
      </Space>
    </>
  );
}
