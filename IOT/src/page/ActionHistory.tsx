import { useState } from "react";
import { Table, Input, Button, Select, Space, message, Tooltip } from "antd";
import {
  CopyOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

interface DeviceRecord {
  id: string;
  device: string;
  status: string;
  time: string;
}

export default function ActionHistory() {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [filterDevice, setFilterDevice] = useState<string>("all");
  const [filterTime, setFilterTime] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Dữ liệu mẫu
  const allData: DeviceRecord[] = [
    { id: "DEV-001", device: "Quạt", status: "Bật", time: "2025-10-16 14:10:00" },
    { id: "DEV-002", device: "Đèn", status: "Tắt", time: "2025-10-16 14:12:00" },
    { id: "DEV-003", device: "Điều hòa", status: "Bật", time: "2025-10-16 14:15:00" },
    { id: "DEV-004", device: "Quạt", status: "Tắt", time: "2025-10-16 14:20:00" },
    { id: "DEV-005", device: "Đèn", status: "Bật", time: "2025-10-16 14:25:00" },
    { id: "DEV-006", device: "Điều hòa", status: "Tắt", time: "2025-10-16 14:30:00" },
  ];

  // Copy ID hoặc thời gian
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã copy: ${text}`);
  };

  // Hàm tìm kiếm
  const handleSearch = () => {
    setLoading(true);

    const searchParams = {
      page,
      limit,
      device: filterDevice,
      time: filterTime,
      sort: sortOrder,
    };

    console.log("🔍 Search params:", searchParams);

    setTimeout(() => {
      setLoading(false);
      message.info(
        `Tìm kiếm thiết bị [${filterDevice}] theo thời gian "${filterTime}" (sort: ${sortOrder}, Trang ${page}, Giới hạn ${limit})`
      );
    }, 500);
  };

  // Sắp xếp dữ liệu theo sortOrder
  const sortedData = [...allData].sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
  });

  // Dữ liệu phân trang
  const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Thiết bị",
      dataIndex: "device",
      key: "device",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: (
        <Space>
          Thời gian
          <Button
            type="text"
            size="small"
            icon={
              sortOrder === "asc" ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          />
        </Space>
      ),
      dataIndex: "time",
      key: "time",
      render: (text: string) => (
        <Space>
          <span>{text}</span>
          <Tooltip title="Copy thời gian">
            <CopyOutlined
              onClick={() => handleCopy(text)}
              style={{ cursor: "pointer", color: "#1677ff" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, height: "calc(100vh - 112px)" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Lịch sử bật / tắt thiết bị
      </h1>

      {/* Thanh tìm kiếm */}
      <Space style={{ marginBottom: 16 }} wrap>
        {/* Lọc thiết bị */}
        <Select
          value={filterDevice}
          onChange={(value) => setFilterDevice(value)}
          style={{ width: 180 }}
          options={[
            { value: "all", label: "Tất cả thiết bị" },
            { value: "Quạt", label: "Quạt" },
            { value: "Đèn", label: "Đèn" },
            { value: "Điều hòa", label: "Điều hòa" },
          ]}
        />

        {/* Nhập thời gian */}
        <Input
          placeholder="Nhập thời gian (vd: 2025-10-16)"
          value={filterTime}
          onChange={(e) => setFilterTime(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 240 }}
        />

        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
        >
          Tìm kiếm
        </Button>

        {/* Giới hạn dòng / trang */}
        <Select
          value={limit}
          onChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
          style={{ width: 200 }}
          options={[
            { value: 3, label: "Hiển thị 3 dòng / trang" },
            { value: 5, label: "Hiển thị 5 dòng / trang" },
            { value: 10, label: "Hiển thị 10 dòng / trang" },
          ]}
        />
      </Space>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="id"
        bordered
        pagination={{
          current: page,
          pageSize: limit,
          total: allData.length,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
      />
    </div>
  );
}
