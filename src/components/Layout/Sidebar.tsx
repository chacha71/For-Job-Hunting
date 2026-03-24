import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TagOutlined,
  TeamOutlined,
  SettingOutlined,
  WechatOutlined,
  FileExcelOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  MessageOutlined,
  SafetyOutlined,
  ClusterOutlined
} from '@ant-design/icons';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">数据看板</Link>,
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: <Link to="/customers">客户管理</Link>,
    },
    {
      key: '/followups',
      icon: <FileTextOutlined />,
      label: <Link to="/followups">跟进台账</Link>,
    },
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: <Link to="/analysis">智能分析</Link>,
    },
    {
      key: '/tags',
      icon: <TagOutlined />,
      label: <Link to="/tags">需求标签库</Link>,
    },
    {
      key: '/competitors',
      icon: <TeamOutlined />,
      label: <Link to="/competitors">竞品分析</Link>,
    },
    {
      key: '/activities',
      icon: <CalendarOutlined />,
      label: <Link to="/activities">活动运营</Link>,
    },
    {
      key: '/messages',
      icon: <MessageOutlined />,
      label: <Link to="/messages">消息推送</Link>,
    },
    {
      key: '/templates',
      icon: <AppstoreOutlined />,
      label: <Link to="/templates">模板管理</Link>,
    },
    {
      key: '/permissions',
      icon: <SafetyOutlined />,
      label: <Link to="/permissions">权限管理</Link>,
    },

    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">系统设置</Link>,
    },
  ];

  return (
    <div style={{ width: 220, background: '#001529', height: '100vh', position: 'fixed' }}>
      <div style={{
        padding: '20px',
        color: 'white',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <h3 style={{ color: 'white', margin: 0, fontSize: '16px' }}>
          政企大客户管理
        </h3>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </div>
  );
};

export default Sidebar;
