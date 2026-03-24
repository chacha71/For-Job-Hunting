import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Tag,
  message,
  Upload,
  Popconfirm,
  Drawer,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { Customer } from '@/types';
import { validateCustomer, exportCustomersToExcel, importCustomersFromExcel } from '@/utils/exportImport';
import { classifyCustomer } from '@/utils/customerClassification';

const { Option } = Select;
const { TextArea } = Input;

const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    message.success('删除成功');
  };

  const handleQuickHighPotential = (customer: Customer) => {
    const classification = classifyCustomer(customer);
    updateCustomer(customer.id, { tier: 'A' });
    message.success(`已标记为高潜客户，策略：${classification.strategy}`);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const validation = validateCustomer(values);
      
      if (!validation.valid) {
        message.error(validation.errors.join('，'));
        return;
      }

      const customerData: Customer = {
        id: editingCustomer?.id || `customer_${Date.now()}`,
        ...values,
        tags: values.tags || [],
        requirements: values.requirements || [],
        createdAt: editingCustomer?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingCustomer) {
        updateCustomer(editingCustomer.id, customerData);
        message.success('更新成功');
      } else {
        addCustomer(customerData);
        message.success('添加成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleExport = () => {
    exportCustomersToExcel(customers);
    message.success('导出成功');
  };

  const handleImport = async (info: any) => {
    const { file } = info;
    try {
      const importedCustomers = await importCustomersFromExcel(file);
      importedCustomers.forEach(c => addCustomer(c));
      message.success(`成功导入 ${importedCustomers.length} 条客户数据`);
    } catch (error) {
      message.error('导入失败，请检查文件格式');
    }
  };

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: any, record: Customer) =>
        record.name.includes(value) ||
        record.contactPerson.includes(value) ||
        record.phone.includes(value),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          'government': '政府',
          'enterprise': '企业',
          'state-owned': '国央企',
          'other': '其他'
        };
        return <Tag color={type === 'government' ? 'red' : type === 'state-owned' ? 'orange' : 'blue'}>
          {typeMap[type]}
        </Tag>;
      },
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '分层',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => {
        const colorMap: Record<string, string> = {
          'A': 'red',
          'B': 'orange',
          'C': 'blue'
        };
        return <Tag color={colorMap[tier]}>{tier}级</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          'potential': '潜在',
          'contacting': '接触中',
          'negotiating': '谈判中',
          'cooperating': '合作中',
          'completed': '已完成'
        };
        const colorMap: Record<string, string> = {
          'potential': 'default',
          'contacting': 'processing',
          'negotiating': 'warning',
          'cooperating': 'success',
          'completed': 'default'
        };
        return <Tag color={colorMap[status]}>{statusMap[status]}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Customer) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
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
            icon={<ThunderboltOutlined />}
            onClick={() => handleQuickHighPotential(record)}
          >
            高潜
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除该客户吗？"
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
        <h2 style={{ margin: 0 }}>客户管理</h2>
        <Space>
          <Input
            placeholder="搜索客户名称/联系人/电话"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Upload
            accept=".xlsx,.xls"
            showUploadList={false}
            customRequest={handleImport}
          >
            <Button icon={<UploadOutlined />}>批量导入</Button>
          </Upload>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出台账
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增客户
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingCustomer ? '编辑客户' : '新增客户'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="客户类型"
            rules={[{ required: true, message: '请选择客户类型' }]}
          >
            <Select placeholder="请选择客户类型">
              <Option value="government">政府</Option>
              <Option value="enterprise">企业</Option>
              <Option value="state-owned">国央企</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="industry"
            label="行业"
            rules={[{ required: true, message: '请输入行业' }]}
          >
            <Input placeholder="请输入行业" />
          </Form.Item>

          <Form.Item
            name="scale"
            label="规模"
            rules={[{ required: true, message: '请选择规模' }]}
          >
            <Select placeholder="请选择规模">
              <Option value="large">大型</Option>
              <Option value="medium">中型</Option>
              <Option value="small">小型</Option>
            </Select>
          </Form.Item>

          <Form.Item name="annualRevenue" label="年营收(万)">
            <InputNumber placeholder="请输入年营收" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="potential">潜在客户</Option>
              <Option value="contacting">接触中</Option>
              <Option value="negotiating">谈判中</Option>
              <Option value="cooperating">合作中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="tier"
            label="分层"
            rules={[{ required: true, message: '请选择分层' }]}
          >
            <Select placeholder="请选择分层">
              <Option value="A">A级</Option>
              <Option value="B">B级</Option>
              <Option value="C">C级</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="请选择或输入标签" />
          </Form.Item>

          <Form.Item name="requirements" label="需求">
            <Select mode="tags" placeholder="请选择或输入需求" />
          </Form.Item>

          <Form.Item name="notes" label="备注">
            <TextArea rows={4} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="客户详情"
        placement="right"
        width={600}
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
      >
        {selectedCustomer && (
          <div>
            <p><strong>客户名称：</strong>{selectedCustomer.name}</p>
            <p><strong>客户类型：</strong>{selectedCustomer.type}</p>
            <p><strong>行业：</strong>{selectedCustomer.industry}</p>
            <p><strong>规模：</strong>{selectedCustomer.scale}</p>
            <p><strong>联系人：</strong>{selectedCustomer.contactPerson}</p>
            <p><strong>联系电话：</strong>{selectedCustomer.phone}</p>
            <p><strong>邮箱：</strong>{selectedCustomer.email || '-'}</p>
            <p><strong>地址：</strong>{selectedCustomer.address}</p>
            <p><strong>状态：</strong>{selectedCustomer.status}</p>
            <p><strong>分层：</strong>{selectedCustomer.tier}级</p>
            <p><strong>标签：</strong>{selectedCustomer.tags.join(', ') || '-'}</p>
            <p><strong>需求：</strong>{selectedCustomer.requirements.join(', ') || '-'}</p>
            <p><strong>备注：</strong>{selectedCustomer.notes || '-'}</p>
            <p><strong>创建时间：</strong>{new Date(selectedCustomer.createdAt).toLocaleString()}</p>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Customers;
