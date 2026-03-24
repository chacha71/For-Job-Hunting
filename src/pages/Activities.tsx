import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space, Tag, Tabs, message, Popconfirm, Statistic, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserAddOutlined, ExportOutlined } from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { Activity, Lead, ActivityRegistration } from '@/types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const Activities: React.FC = () => {
  const { activities, leads, addActivity, updateActivity, deleteActivity, addLead, updateLead, deleteLead, convertLeadToCustomer, customers } = useStore();
  const [activeTab, setActiveTab] = useState('activities');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form] = Form.useForm();
  const [leadForm] = Form.useForm();

  const activityTypeMap = {
    seminar: { text: '研讨会', color: 'blue' },
    exhibition: { text: '展会', color: 'green' },
    meeting: { text: '商务会议', color: 'purple' },
    training: { text: '培训会', color: 'orange' },
    online: { text: '线上活动', color: 'cyan' },
    other: { text: '其他', color: 'default' },
  };

  const activityStatusMap = {
    draft: { text: '草稿', color: 'default' },
    published: { text: '已发布', color: 'blue' },
    ongoing: { text: '进行中', color: 'green' },
    completed: { text: '已结束', color: 'gray' },
    cancelled: { text: '已取消', color: 'red' },
  };

  const leadStatusMap = {
    new: { text: '新线索', color: 'blue' },
    contacted: { text: '已联系', color: 'orange' },
    qualified: { text: '已确认', color: 'green' },
    converted: { text: '已转化', color: 'purple' },
    lost: { text: '已流失', color: 'red' },
  };

  const leadSourceMap = {
    activity: { text: '活动', color: 'blue' },
    web: { text: '官网', color: 'green' },
    referral: { text: '转介绍', color: 'purple' },
    phone: { text: '电话', color: 'orange' },
    other: { text: '其他', color: 'default' },
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditActivity = (record: Activity) => {
    setEditingActivity(record);
    form.setFieldsValue({
      ...record,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
    });
    setIsModalOpen(true);
  };

  const handleDeleteActivity = (id: string) => {
    deleteActivity(id);
    message.success('删除成功');
  };

  const handleSubmitActivity = () => {
    form.validateFields().then(values => {
      const activityData: Activity = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        id: editingActivity?.id || `activity_${Date.now()}`,
        registrations: editingActivity?.registrations || [],
        leads: editingActivity?.leads || [],
        createdBy: editingActivity?.createdBy || '1',
        createdAt: editingActivity?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingActivity) {
        updateActivity(editingActivity.id, activityData);
        message.success('更新成功');
      } else {
        addActivity(activityData);
        message.success('创建成功');
      }
      setIsModalOpen(false);
    });
  };

  const handleAddLead = () => {
    setEditingLead(null);
    leadForm.resetFields();
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (record: Lead) => {
    setEditingLead(record);
    leadForm.setFieldsValue(record);
    setIsLeadModalOpen(true);
  };

  const handleDeleteLead = (id: string) => {
    deleteLead(id);
    message.success('删除成功');
  };

  const handleSubmitLead = () => {
    leadForm.validateFields().then(values => {
      const leadData: Lead = {
        ...values,
        id: editingLead?.id || `lead_${Date.now()}`,
        activityId: editingLead?.activityId || '',
        createdAt: editingLead?.createdAt || new Date().toISOString(),
      };

      if (editingLead) {
        updateLead(editingLead.id, leadData);
        message.success('更新成功');
      } else {
        addLead(leadData);
        message.success('创建成功');
      }
      setIsLeadModalOpen(false);
    });
  };

  const handleConvertLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead?.status !== 'qualified') {
      message.warning('只有已确认的线索才能转化为客户');
      return;
    }
    convertLeadToCustomer(leadId);
    message.success('线索已转化为客户');
  };

  const activityColumns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: keyof typeof activityTypeMap) => (
        <Tag color={activityTypeMap[type]?.color}>{activityTypeMap[type]?.text}</Tag>
      ),
    },
    {
      title: '时间',
      key: 'date',
      render: (_: any, record: Activity) => (
        `${record.startDate} ~ ${record.endDate}`
      ),
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof activityStatusMap) => (
        <Tag color={activityStatusMap[status]?.color}>{activityStatusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '报名人数',
      key: 'registrations',
      render: (_: any, record: Activity) => (
        <Tag color="blue">{record.registrations?.length || 0}</Tag>
      ),
    },
    {
      title: '线索数',
      key: 'leads',
      render: (_: any, record: Activity) => {
        const leadCount = leads.filter(l => l.activityId === record.id).length;
        return <Tag color="green">{leadCount}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Activity) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditActivity(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDeleteActivity(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const leadColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (source: keyof typeof leadSourceMap) => (
        <Tag color={leadSourceMap[source]?.color}>{leadSourceMap[source]?.text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof leadStatusMap) => (
        <Tag color={leadStatusMap[status]?.color}>{leadStatusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '需求',
      dataIndex: 'requirement',
      key: 'requirement',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Lead) => (
        <Space>
          <Button type="link" onClick={() => handleEditLead(record)}>编辑</Button>
          {record.status === 'qualified' && (
            <Button type="link" onClick={() => handleConvertLead(record.id)}>转为客户</Button>
          )}
          <Popconfirm title="确认删除?" onConfirm={() => handleDeleteLead(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 统计卡片数据
  const totalActivities = activities.length;
  const ongoingActivities = activities.filter(a => a.status === 'ongoing').length;
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;

  return (
    <div style={{ padding: '24px', marginLeft: '220px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      <h2 style={{ marginBottom: '24px' }}>活动运营</h2>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="活动总数" value={totalActivities} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="进行中活动" value={ongoingActivities} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="线索总数" value={totalLeads} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="已转化客户" value={convertedLeads} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'activities',
              label: '活动管理',
              children: (
                <>
                  <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddActivity}>
                      创建活动
                    </Button>
                    <Button icon={<ExportOutlined />}>导出数据</Button>
                  </Space>
                  <Table
                    columns={activityColumns}
                    dataSource={activities}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
            {
              key: 'leads',
              label: '线索管理',
              children: (
                <>
                  <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddLead}>
                      添加线索
                    </Button>
                    <Button icon={<ExportOutlined />}>导出线索</Button>
                  </Space>
                  <Table
                    columns={leadColumns}
                    dataSource={leads}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* 活动表单弹窗 */}
      <Modal
        title={editingActivity ? '编辑活动' : '创建活动'}
        open={isModalOpen}
        onOk={handleSubmitActivity}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="活动名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="活动类型" rules={[{ required: true }]}>
            <Select>
              <Option value="seminar">研讨会</Option>
              <Option value="exhibition">展会</Option>
              <Option value="meeting">商务会议</Option>
              <Option value="training">培训会</Option>
              <Option value="online">线上活动</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="活动描述">
            <TextArea rows={3} />
          </Form.Item>
          <Space style={{ width: '100%' }} split>
            <Form.Item name="startDate" label="开始时间" rules={[{ required: true }]} style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="endDate" label="结束时间" rules={[{ required: true }]} style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item name="location" label="地点">
            <Input />
          </Form.Item>
          <Form.Item name="organizer" label="主办方">
            <Input />
          </Form.Item>
          <Form.Item name="maxParticipants" label="最大参与人数">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="published">已发布</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="completed">已结束</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 线索表单弹窗 */}
      <Modal
        title={editingLead ? '编辑线索' : '添加线索'}
        open={isLeadModalOpen}
        onOk={handleSubmitLead}
        onCancel={() => setIsLeadModalOpen(false)}
        width={600}
      >
        <Form form={leadForm} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="电话" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="company" label="公司">
            <Input />
          </Form.Item>
          <Form.Item name="position" label="职位">
            <Input />
          </Form.Item>
          <Form.Item name="source" label="来源" rules={[{ required: true }]}>
            <Select>
              <Option value="activity">活动</Option>
              <Option value="web">官网</Option>
              <Option value="referral">转介绍</Option>
              <Option value="phone">电话</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="requirement" label="需求描述">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Option value="new">新线索</Option>
              <Option value="contacted">已联系</Option>
              <Option value="qualified">已确认</Option>
              <Option value="converted">已转化</Option>
              <Option value="lost">已流失</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Activities;
