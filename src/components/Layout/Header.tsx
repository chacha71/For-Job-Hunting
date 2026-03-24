import React from 'react';
import { Layout, Button, Space, Badge, notification } from 'antd';
import { BellOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const handleNotification = () => {
    notification.info({
      message: '通知中心',
      description: '暂无新通知',
      placement: 'bottomRight',
    });
  };

  return (
    <AntHeader style={{
      padding: '0 24px',
      background: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 220,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        政企大客户数字化运营工具
      </div>
      <Space size="large">
        <Badge count={0} showZero>
          <Button
            type="text"
            icon={<BellOutlined />}
            onClick={handleNotification}
          >
            通知
          </Button>
        </Badge>
        <Button
          type="text"
          icon={<LogoutOutlined />}
        >
          退出
        </Button>
      </Space>
    </AntHeader>
  );
};

export default Header;
