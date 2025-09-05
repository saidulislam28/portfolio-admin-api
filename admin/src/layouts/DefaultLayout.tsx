/* eslint-disable */
import { Layout, Spin, theme } from 'antd';
import React, { useEffect, useState, Suspense } from 'react';
import HeaderNav from './Header';
import DashboardSidebar from './Sidebar';
import { Route, Routes } from 'react-router-dom';
const { Content, Sider, Footer } = Layout;
import routes from '../routes';
import NotFound from './NotFound';

const DefaultLayout = ({ children }: any) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <DashboardSidebar />
      </Sider>
      <Layout className="site-layout">
        <Content style={{ backgroundColor: '#ddd', padding: 15 }}>
          <Suspense fallback={<Spin size="large" />}>
            <Routes>
              {routes.map((route, idx) => {
                return (
                  route.element && (
                    <Route key={idx} path={route.path} element={<route.element />} />
                  )
                );
              })}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
