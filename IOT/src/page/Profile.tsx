import { Avatar, Button, Card, Col, Row, Space, Typography } from "antd";
import { GithubOutlined, FilePdfOutlined, ApiOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Profile() {
  return (
    <div
      style={{
        padding: "40px 60px",
        background: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          padding: 32,
          background: "#fff",
        }}
      >
        <Row gutter={[32, 32]} align="middle">
          {/* Ảnh và tên sinh viên */}
          <Col xs={24} md={6} style={{ textAlign: "center" }}>
            <Avatar
              size={140}
              src="https://api.dicebear.com/8.x/avataaars/svg?seed=student"
              style={{
                marginBottom: 16,
                border: "3px solid #1677ff",
              }}
            />
            <Title level={4} style={{ marginBottom: 4 }}>
              Nguyễn Thọ Đan
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Mã sinh viên: B22DCCN179
            </Text>
          </Col>

          {/* Thông tin chi tiết */}
          <Col xs={24} md={10}>
            <Title level={5}>Thông tin cá nhân</Title>
            <div style={{ lineHeight: "2rem", fontSize: 16 }}>
              <p>
                <b>Khoa:</b> Công nghệ thông tin
              </p>
              <p>
                <b>Lớp:</b> D22CQCN11-B
              </p>
              <p>
                <b>Chuyên ngành:</b> Kỹ thuật phần mềm
              </p>
              <p>
                <b>Email:</b> ntdan@example.com
              </p>
              <p>
                <b>Ngày sinh:</b> 12/04/2004
              </p>
            </div>
          </Col>

          {/* Nút hành động */}
          <Col xs={24} md={8} style={{ textAlign: "center" }}>
            <Title level={5}>Liên kết nhanh</Title>
            <Space
              direction="vertical"
              size="large"
              style={{ width: "100%", marginTop: 16 }}
            >
              <Button
                type="default"
                icon={<GithubOutlined />}
                href="https://github.com/your-github"
                target="_blank"
                size="large"
                block
              >
                GitHub
              </Button>

              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                href="/profile.pdf"
                target="_blank"
                size="large"
                block
              >
                PDF Hồ sơ
              </Button>

              <Button
                type="dashed"
                icon={<ApiOutlined />}
                href="http://localhost:8080/swagger-ui/index.html"
                target="_blank"
                size="large"
                block
              >
                Swagger API
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
