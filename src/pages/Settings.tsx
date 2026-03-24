import React from 'react';
import { Card, Form, Input, Button, Divider, Space, Typography, message, Switch } from 'antd';
import { SaveOutlined, UserOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [notificationForm] = Form.useForm();

  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      // 这里可以添加保存逻辑
      console.log('保存个人信息:', values);
      message.success('个人信息保存成功');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const handleSaveNotification = async () => {
    try {
      const values = await notificationForm.validateFields();
      // 这里可以添加保存逻辑
      console.log('保存通知设置:', values);
      message.success('通知设置保存成功');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  return (
    <div style={{ padding: '24px', marginLeft: '220px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>系统设置</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 个人信息 */}
        <Card
          title={
            <Space>
              <UserOutlined />
              个人信息
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              username: 'admin',
              email: 'admin@example.com',
              phone: '13800138000',
            }}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            
            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveProfile}
              >
                保存个人信息
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 通知设置 */}
        <Card
          title={
            <Space>
              <BellOutlined />
              通知设置
            </Space>
          }
        >
          <Form
            form={notificationForm}
            layout="vertical"
            initialValues={{
              emailNotification: true,
              wechatNotification: false,
              followUpReminder: true,
              dailyReport: false,
            }}
          >
            <Form.Item
              name="emailNotification"
              label="邮件通知"
              valuePropName="checked"
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
            
            <Form.Item
              name="wechatNotification"
              label="企业微信通知"
              valuePropName="checked"
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
            
            <Form.Item
              name="followUpReminder"
              label="跟进提醒"
              valuePropName="checked"
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
            
            <Form.Item
              name="dailyReport"
              label="每日报告"
              valuePropName="checked"
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveNotification}
              >
                保存通知设置
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 修改密码 */}
        <Card
          title={
            <Space>
              <LockOutlined />
              修改密码
            </Space>
          }
        >
          <Form layout="vertical">
            <Form.Item
              name="currentPassword"
              label="当前密码"
              rules={[{ required: true, message: '请输入当前密码' }]}
            >
              <Input.Password placeholder="请输入当前密码" />
            </Form.Item>
            
            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码至少6位' }
              ]}
            >
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              label="确认新密码"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="请再次输入新密码" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" icon={<SaveOutlined />}>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 系统信息 */}
        <Card title="系统信息">
          <Space direction="vertical" size="small">
            <Text><strong>系统版本：</strong>V1.0.0</Text>
            <Text><strong>更新时间：</strong>2024-03-08</Text>
            <Text><strong>技术支持：</strong>Tencent CodeBuddy</Text>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default Settings;
