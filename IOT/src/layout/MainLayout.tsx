import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  RadarChartOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Sider, Header, Content } = Layout;

export default function MainLayout() {
  const location = useLocation();

  const items = [
    { key: "/", icon: <HomeOutlined />, label: <Link to="/">Trang chủ</Link> },
    { key: "/profile", icon: <UserOutlined />, label: <Link to="/profile">Hồ sơ</Link> },
    { key: "/sensor", icon: <RadarChartOutlined />, label: <Link to="/sensor">Cảm biến</Link> },
    { key: "/action-history", icon: <HistoryOutlined />, label: <Link to="/action-history">Lịch sử hành động</Link> },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        theme="dark"
        breakpoint="lg"
        collapsedWidth="60"
        style={{
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: 0.5,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          IOT DASHBOARD
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          style={{
            fontSize: 15,
            fontWeight: 500,
          }}
        />
      </Sider>

      {/* MAIN SECTION */}
      <Layout>
        {/* HEADER */}
        <Header
          style={{
            background: "#fff",
            fontSize: 18,
            fontWeight: 600,
            padding: "0 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          Dashboard
        </Header>

        {/* CONTENT */}
        <Content
          style={{
            flex: 1,
            margin: 24,
            padding: 24,
            background: "#fff",
            borderRadius: 12,
            overflow: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
