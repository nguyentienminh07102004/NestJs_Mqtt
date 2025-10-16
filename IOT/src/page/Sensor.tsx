import { useEffect, useState } from "react";
import { Table, Input, Button, Select, Space, message, Tooltip } from "antd";
import { CopyOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

type SensorRecord = {
	id: string;
	temperature: string;
	humidity: string;
	brightness: string;
	createdDate: string;
};

export default function Sensor() {
	const [searchField, setSearchField] = useState("all");
	const [searchValue, setSearchValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [limit, setLimit] = useState(5);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState<keyof SensorRecord | "">("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [total, setTotal] = useState(0);
	const [allData, setAllData] = useState<SensorRecord[]>([]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				sort: sortOrder.toUpperCase(),
				sortBy: sortBy || "createdDate",
				type: searchField,
				value: searchValue,
			});
			const res = await fetch(`http://localhost:3000/api/v1/datasensors/search?${params}`);
			const json = await res.json();
			setAllData(json.data || []);
			setTotal(json.total || 0);
		} catch (err) {
			console.error(err);
			message.error("Không thể tải dữ liệu cảm biến");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [page, limit, sortBy, sortOrder]);

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		message.success(`Đã copy: ${text}`);
	};

	const handleSearch = () => {
		setPage(1);
		fetchData();
	};

	const toggleSort = (field: keyof SensorRecord) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	const columns = [
		{ title: "ID", dataIndex: "id", key: "id" },
		{
			title: (
				<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
					Nhiệt độ
					<span onClick={() => toggleSort("temperature")} style={{ cursor: "pointer" }}>
						{sortBy === "temperature" ? (
							sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />
						) : (
							<ArrowUpOutlined style={{ opacity: 0.3 }} />
						)}
					</span>
				</div>
			),
			dataIndex: "temperature",
			key: "temperature",
		},
		{
			title: (
				<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
					Độ ẩm
					<span onClick={() => toggleSort("humidity")} style={{ cursor: "pointer" }}>
						{sortBy === "humidity" ? (
							sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />
						) : (
							<ArrowUpOutlined style={{ opacity: 0.3 }} />
						)}
					</span>
				</div>
			),
			dataIndex: "humidity",
			key: "humidity",
		},
		{
			title: (
				<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
					Ánh sáng
					<span onClick={() => toggleSort("brightness")} style={{ cursor: "pointer" }}>
						{sortBy === "brightness" ? (
							sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />
						) : (
							<ArrowUpOutlined style={{ opacity: 0.3 }} />
						)}
					</span>
				</div>
			),
			dataIndex: "brightness",
			key: "brightness",
		},
		{
			title: (
				<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
					Thời gian
					<span onClick={() => toggleSort("createdDate")} style={{ cursor: "pointer" }}>
						{sortBy === "createdDate" ? (
							sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />
						) : (
							<ArrowUpOutlined style={{ opacity: 0.3 }} />
						)}
					</span>
				</div>
			),
			dataIndex: "createdDate",
			key: "createdDate",
			render: (text: string) => (
				<Space>
					<span>{text}</span>
					<Tooltip title="Copy thời gian">
						<CopyOutlined onClick={() => handleCopy(text)} style={{ cursor: "pointer", color: "#1677ff" }} />
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<div>
			<h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>📊 Lịch sử cảm biến</h1>

			<Space style={{ marginBottom: 16 }} wrap>
				<Select
					value={searchField}
					onChange={setSearchField}
					style={{ width: 180 }}
					options={[
						{ value: "all", label: "Tất cả" },
						{ value: "temperature", label: "Nhiệt độ" },
						{ value: "humidity", label: "Độ ẩm" },
						{ value: "brightness", label: "Ánh sáng" },
						{ value: "createdDate", label: "Thời gian" },
					]}
				/>

				<Input
					placeholder="Nhập từ khóa tìm kiếm..."
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					style={{ width: 260 }}
				/>

				<Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
					Tìm kiếm
				</Button>

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

			<Table
				columns={columns}
				dataSource={allData}
				rowKey="id"
				bordered
				loading={loading}
				pagination={{
					current: page,
					pageSize: limit,
					total: total,
					onChange: (p) => setPage(p),
					showSizeChanger: false,
				}}
			/>
		</div>
	);
}