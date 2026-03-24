import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Tag, Tabs, message, Popconfirm, Statistic, Row, Col, Checkbox, DatePicker, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined, MessageOutlined, BellOutlined, ClockCircleOutlined, ExportOutlined } from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { MessageTemplate, Message, MessageCampaign } from '@/types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const Messages: React.FC = () => {
  const { messageTemplates, messages, messageCampaigns, customers, addMessageTemplate, updateMessageTemplate, deleteMessageTemplate, addMessage, addMessageCampaign, updateMessageCampaign, deleteMessageCampaign } = useStore();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<MessageCampaign | null>(null);
  const [form] = Form.useForm();
  const [campaignForm] = Form.useForm();
  const [sendForm] = Form.useForm();

  const channelMap = {
    sms: { text: '短信', color: 'orange' },
    email: { text: '邮件', color: 'purple' },
    app: { text: 'APP推送', color: 'green' },
  };

  const messageTypeMap = {
    followup_reminder: { text: '跟进提醒', color: 'blue' },
    customer_notify: { text: '客户通知', color: 'green' },
    activity_notification: { text: '活动通知', color: 'purple' },
    custom: { text: '自定义', color: 'default' },
  };

  const campaignStatusMap = {
    draft: { text: '草稿', color: 'default' },
    scheduled: { text: '已定时', color: 'blue' },
    sending: { text: '发送中', color: 'orange' },
    completed: { text: '已完成', color: 'green' },
    failed: { text: '失败', color: 'red' },
  };

  const messageStatusMap = {
    pending: { text: '待发送', color: 'default' },
    sent: { text: '已发送', color: 'blue' },
    failed: { text: '失败', color: 'red' },
    read: { text: '已读', color: 'green' },
  };

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    form.resetFields();
    setIsTemplateModalOpen(true);
  };

  const handleEditTemplate = (record: MessageTemplate) => {
    setEditingTemplate(record);
    form.setFieldsValue(record);
    setIsTemplateModalOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    deleteMessageTemplate(id);
    message.success('删除成功');
  };

  const handleSubmitTemplate = () => {
    form.validateFields().then(values => {
      const templateData: MessageTemplate = {
        ...values,
        id: editingTemplate?.id || `template_${Date.now()}`,
        createdBy: editingTemplate?.createdBy || '1',
        createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      };

      if (editingTemplate) {
        updateMessageTemplate(editingTemplate.id, templateData);
        message.success('更新成功');
      } else {
        addMessageTemplate(templateData);
        message.success('创建成功');
      }
      setIsTemplateModalOpen(false);
    });
  };

  const handleAddCampaign = () => {
    setEditingCampaign(null);
    campaignForm.resetFields();
    setIsCampaignModalOpen(true);
  };

  const handleSubmitCampaign = () => {
    campaignForm.validateFields().then(values => {
      const targetType = values.targetType;
      let targetFilters = undefined;
      
      if (targetType === 'tier') {
        targetFilters = { tiers: values.tiers };
      } else if (targetType === 'industry') {
        targetFilters = { industries: values.industries };
      } else if (targetType === 'custom') {
        targetFilters = { customerIds: values.customerIds };
      }

      const campaignData: MessageCampaign = {
        ...values,
        targetFilters,
        targetType,
        id: editingCampaign?.id || `campaign_${Date.now()}`,
        totalCount: 0,
        sentCount: 0,
        failedCount: 0,
        createdBy: editingCampaign?.createdBy || '1',
        createdAt: new Date().toISOString(),
      };

      addMessageCampaign(campaignData);
      message.success('创建成功');
      setIsCampaignModalOpen(false);
    });
  };

  const handleSendNow = (record: MessageCampaign) => {
    // 模拟发送消息
    const targetCustomers = customers.filter(c => {
      if (!record.targetFilters) return true;
      if (record.targetFilters.tiers?.length && !record.targetFilters.tiers.includes(c.tier)) return false;
      if (record.targetFilters.industries?.length && !record.targetFilters.industries.includes(c.industry)) return false;
      if (record.targetFilters.customerIds?.length && !record.targetFilters.customerIds.includes(c.id)) return false;
      return true;
    });

    const newMessages: Message[] = targetCustomers.map(c => ({
      id: `msg_${Date.now()}_${c.id}`,
      templateId: record.templateId,
      channel: record.channel,
      type: record.template?.type || 'custom',
      recipientId: c.id,
      recipientName: c.name,
      recipientPhone: c.phone,
      title: record.template?.title,
      content: record.template?.content.replace(/{{(\w+)}}/g, (_, key) => {
        const replacements: Record<string, string> = {
          name: c.contactPerson,
          customerName: c.name,
          phone: c.phone,
        };
        return replacements[key] || '';
      }) || '您好',
      status: 'sent' as const,
      sentAt: new Date().toISOString(),
      createdBy: '1',
      createdAt: new Date().toISOString(),
    }));

    newMessages.forEach(msg => addMessage(msg));
    updateMessageCampaign(record.id, { 
      status: 'completed', 
      sentCount: newMessages.length,
      completedAt: new Date().toISOString() 
    });
    message.success(`成功发送 ${newMessages.length} 条消息`);
  };

  const handleSendSingle = () => {
    sendForm.validateFields().then(values => {
      const messageData: Message = {
        ...values,
        id: `msg_${Date.now()}`,
        status: 'sent',
        sentAt: new Date().toISOString(),
        createdBy: '1',
        createdAt: new Date().toISOString(),
      };
      addMessage(messageData);
      message.success('发送成功');
      setIsSendModalOpen(false);
    });
  };

  const templateColumns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel: keyof typeof channelMap) => (
        <Tag color={channelMap[channel]?.color}>{channelMap[channel]?.text}</Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: keyof typeof messageTypeMap) => (
        <Tag color={messageTypeMap[type]?.color}>{messageTypeMap[type]?.text}</Tag>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '内容预览',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content: string) => content?.substring(0, 50) + '...',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MessageTemplate) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditTemplate(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDeleteTemplate(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const campaignColumns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel: keyof typeof channelMap) => (
        <Tag color={channelMap[channel]?.color}>{channelMap[channel]?.text}</Tag>
      ),
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
      key: 'targetType',
      render: (type: string) => {
        const map: Record<string, string> = {
          all: '全部客户',
          tier: '按分层',
          industry: '按行业',
          custom: '指定客户',
        };
        return map[type] || type;
      },
    },
    {
      title: '发送状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof campaignStatusMap) => (
        <Tag color={campaignStatusMap[status]?.color}>{campaignStatusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '发送进度',
      key: 'progress',
      render: (_: any, record: MessageCampaign) => (
        `${record.sentCount || 0} / ${record.totalCount || 0}`
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MessageCampaign) => (
        <Space>
          {record.status === 'draft' && (
            <Button type="link" icon={<SendOutlined />} onClick={() => handleSendNow(record)}>
              立即发送
            </Button>
          )}
          <Button type="link" icon={<ClockCircleOutlined />}>定时发送</Button>
        </Space>
      ),
    },
  ];

  const messageColumns = [
    {
      title: '接收人',
      dataIndex: 'recipientName',
      key: 'recipientName',
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel: keyof typeof channelMap) => (
        <Tag color={channelMap[channel]?.color}>{channelMap[channel]?.text}</Tag>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof messageStatusMap) => (
        <Tag color={messageStatusMap[status]?.color}>{messageStatusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '发送时间',
      dataIndex: 'sentAt',
      key: 'sentAt',
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-',
    },
  ];

  // 统计数据
  const totalCampaigns = messageCampaigns.length;
  const sentMessages = messages.filter(m => m.status === 'sent' || m.status === 'read').length;
  const pendingMessages = messages.filter(m => m.status === 'pending').length;
  const readMessages = messages.filter(m => m.status === 'read').length;

  return (
    <div style={{ padding: '24px', marginLeft: '220px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      <h2 style={{ marginBottom: '24px' }}>消息推送</h2>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="消息模板" value={messageTemplates.length} valueStyle={{ color: '#1890ff' }} prefix={<MessageOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="发送活动" value={totalCampaigns} valueStyle={{ color: '#52c41a' }} prefix={<BellOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="已发送" value={sentMessages} valueStyle={{ color: '#722ed1' }} prefix={<SendOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="已读" value={readMessages} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'campaigns',
              label: '消息群发',
              children: (
                <>
                  <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCampaign}>
                      创建群发
                    </Button>
                    <Button icon={<SendOutlined />} onClick={() => setIsSendModalOpen(true)}>
                      单独发送
                    </Button>
                    <Button icon={<ExportOutlined />}>导出记录</Button>
                  </Space>
                  <Table
                    columns={campaignColumns}
                    dataSource={messageCampaigns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
            {
              key: 'templates',
              label: '消息模板',
              children: (
                <>
                  <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTemplate}>
                      创建模板
                    </Button>
                  </Space>
                  <Table
                    columns={templateColumns}
                    dataSource={messageTemplates}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
            {
              key: 'records',
              label: '发送记录',
              children: (
                <>
                  <Space style={{ marginBottom: 16 }}>
                    <Input.Search placeholder="搜索接收人" style={{ width: 200 }} />
                    <Select placeholder="筛选渠道" style={{ width: 120 }} allowClear>

                      <Option value="sms">短信</Option>
                      <Option value="email">邮件</Option>
                    </Select>
                    <Button icon={<ExportOutlined />}>导出记录</Button>
                  </Space>
                  <Table
                    columns={messageColumns}
                    dataSource={messages}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* 模板弹窗 */}
      <Modal
        title={editingTemplate ? '编辑模板' : '创建模板'}
        open={isTemplateModalOpen}
        onOk={handleSubmitTemplate}
        onCancel={() => setIsTemplateModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="channel" label="发送渠道" rules={[{ required: true }]}>
            <Select>
              <Option value="sms">短信</Option>
              <Option value="email">邮件</Option>
              <Option value="app">APP推送</Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="消息类型" rules={[{ required: true }]}>
            <Select>
              <Option value="followup_reminder">跟进提醒</Option>
              <Option value="customer_notify">客户通知</Option>
              <Option value="activity_notification">活动通知</Option>
              <Option value="custom">自定义</Option>
            </Select>
          </Form.Item>
          <Form.Item name="title" label="标题">
            <Input placeholder="短信/邮件标题" />
          </Form.Item>
          <Form.Item name="content" label="消息内容" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="支持变量：{{name}}、{{customerName}}、{{phone}}等" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 群发弹窗 */}
      <Modal
        title="创建消息群发"
        open={isCampaignModalOpen}
        onOk={handleSubmitCampaign}
        onCancel={() => setIsCampaignModalOpen(false)}
        width={600}
      >
        <Form form={campaignForm} layout="vertical">
          <Form.Item name="name" label="活动名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="活动描述">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="channel" label="发送渠道" rules={[{ required: true }]}>
            <Select>
              <Option value="sms">短信</Option>
              <Option value="email">邮件</Option>
              <Option value="app">APP推送</Option>
            </Select>
          </Form.Item>
          <Form.Item name="templateId" label="选择模板">
            <Select allowClear>
              {messageTemplates.map(t => (
                <Option key={t.id} value={t.id}>{t.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Divider>目标客户</Divider>
          <Form.Item name="targetType" label="目标类型" rules={[{ required: true }]}>
            <Select>
              <Option value="all">全部客户</Option>
              <Option value="tier">按客户分层</Option>
              <Option value="industry">按行业</Option>
              <Option value="custom">指定客户</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 单独发送弹窗 */}
      <Modal
        title="发送消息"
        open={isSendModalOpen}
        onOk={handleSendSingle}
        onCancel={() => setIsSendModalOpen(false)}
        width={500}
      >
        <Form form={sendForm} layout="vertical">
          <Form.Item name="recipientId" label="选择客户" rules={[{ required: true }]}>
            <Select showSearch placeholder="搜索客户">
              {customers.map(c => (
                <Option key={c.id} value={c.id}>{c.name} - {c.contactPerson}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="channel" label="发送渠道" rules={[{ required: true }]}>
            <Select>
              <Option value="sms">短信</Option>
              <Option value="email">邮件</Option>
              <Option value="app">APP推送</Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="消息内容" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Messages;
