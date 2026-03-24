import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Badge,
  Tag,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BellOutlined,
  DownloadOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { FollowUp } from '@/types';
import { exportFollowUpsToExcel } from '@/utils/exportImport';
import { tencentIntegration } from '@/utils/tencentIntegration';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const FollowUps: React.FC = () => {
  const { customers, followUps, addFollowUp, updateFollowUp, deleteFollowUp } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [form] = Form.useForm();
  const [upcomingReminders, setUpcomingReminders] = useState<FollowUp[]>([]);

  useEffect(() => {
    // 查找未来7天内需要跟进的记录
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcoming = followUps.filter(f => {
      if (!f.nextDate) return false;
      const nextDate = new Date(f.nextDate);
      return nextDate >= now && nextDate <= sevenDaysLater;
    });
    
    setUpcomingReminders(upcoming);
  }, [followUps]);

  const handleAdd = () => {
    setEditingFollowUp(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (followUp: FollowUp) => {
    setEditingFollowUp(followUp);
    form.setFieldsValue({
      ...followUp,
      date: followUp.date ? dayjs(followUp.date) : undefined,
      nextDate: followUp.nextDate ? dayjs(followUp.nextDate) : undefined,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteFollowUp(id);
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const followUpData: FollowUp = {
        id: editingFollowUp?.id || `followup_${Date.now()}`,
        customerId: values.customerId,
        customerName: customers.find(c => c.id === values.customerId)?.name || '',
        date: values.date.format('YYYY-MM-DD'),
        type: values.type,
        content: values.content,
        outcome: values.outcome,
        nextStep: values.nextStep,
        nextDate: values.nextDate?.format('YYYY-MM-DD'),
        createdBy: '当前用户',
        createdAt: editingFollowUp?.createdAt || new Date().toISOString(),
      };

      if (editingFollowUp) {
        updateFollowUp(editingFollowUp.id, followUpData);
        message.success('更新成功');
      } else {
        addFollowUp(followUpData);
        message.success('添加成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleExport = () => {
    exportFollowUpsToExcel(followUps);
    message.success('导出成功');
  };

  const handleSendToWechat = async (followUp: FollowUp) => {
    try {
      const result = await tencentIntegration.sendFollowUpReminder(followUp);
      if (result) {
        message.success('已发送到企业微信');
      } else {
        message.warning('企业微信未配置');
      }
    } catch (error) {
      message.error('发送失败');
    }
  };

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '跟进日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '跟进方式',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          'visit': '拜访',
          'call': '电话',
          'email': '邮件',
          'meeting': '会议',
          'other': '其他'
        };
        return <Tag color="blue">{typeMap[type]}</Tag>;
      },
    },
    {
      title: '跟进内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '跟进结果',
      dataIndex: 'outcome',
      key: 'outcome',
      render: (outcome: string) => {
        const outcomeMap: Record<string, string> = {
          'success': '成功',
          'pending': '进行中',
          'failed': '失败'
        };
        const colorMap: Record<string, string> = {
          'success': 'success',
          'pending': 'processing',
          'failed': 'error'
        };
        return <Tag color={colorMap[outcome]}>{outcomeMap[outcome]}</Tag>;
      },
    },
    {
      title: '下次跟进',
      dataIndex: 'nextDate',
      key: 'nextDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FollowUp) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<WechatOutlined />}
            onClick={() => handleSendToWechat(record)}
          >
            微信通知
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除该跟进记录吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', marginLeft: '220px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>跟进台账</h2>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出记录
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增跟进
          </Button>
        </Space>
      </div>

      {upcomingReminders.length > 0 && (
        <div style={{ marginBottom: '24px', padding: '16px', background: '#fffbe6', borderRadius: '6px', border: '1px solid #ffe58f' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge count={upcomingReminders.length}>
                <BellOutlined style={{ fontSize: '20px', color: '#faad14' }} />
              </Badge>
              <strong>近期跟进提醒（7天内）</strong>
            </div>
            {upcomingReminders.slice(0, 3).map(reminder => (
              <Tag color="orange" key={reminder.id}>
                {reminder.customerName} - {new Date(reminder.nextDate!).toLocaleDateString()}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={followUps}
        rowKey="id"
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingFollowUp ? '编辑跟进记录' : '新增跟进记录'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="customerId"
            label="客户"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select placeholder="请选择客户">
              {customers.map(customer => (
                <Option key={customer.id} value={customer.id}>
                  {customer.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="跟进日期"
            rules={[{ required: true, message: '请选择跟进日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="type"
            label="跟进方式"
            rules={[{ required: true, message: '请选择跟进方式' }]}
          >
            <Select placeholder="请选择跟进方式">
              <Option value="visit">拜访</Option>
              <Option value="call">电话</Option>
              <Option value="email">邮件</Option>
              <Option value="meeting">会议</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <TextArea rows={4} placeholder="请输入跟进内容" />
          </Form.Item>

          <Form.Item
            name="outcome"
            label="跟进结果"
            rules={[{ required: true, message: '请选择跟进结果' }]}
          >
            <Select placeholder="请选择跟进结果">
              <Option value="success">成功</Option>
              <Option value="pending">进行中</Option>
              <Option value="failed">失败</Option>
            </Select>
          </Form.Item>

          <Form.Item name="nextStep" label="下一步计划">
            <TextArea rows={3} placeholder="请输入下一步计划" />
          </Form.Item>

          <Form.Item name="nextDate" label="下次跟进日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FollowUps;
