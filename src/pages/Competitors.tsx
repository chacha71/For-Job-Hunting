import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { Competitor } from '@/types';
import { exportCompetitorsToExcel } from '@/utils/exportImport';

const { Option } = Select;
const { TextArea } = Input;

const Competitors: React.FC = () => {
  const { customers, competitors, addCompetitor, updateCompetitor, deleteCompetitor } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingCompetitor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (competitor: Competitor) => {
    setEditingCompetitor(competitor);
    form.setFieldsValue(competitor);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteCompetitor(id);
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const competitorData: Competitor = {
        id: editingCompetitor?.id || `competitor_${Date.now()}`,
        customerId: values.customerId,
        customerName: customers.find(c => c.id === values.customerId)?.name || '',
        competitorName: values.competitorName,
        competitorSolution: values.competitorSolution,
        weaknesses: values.weaknesses || [],
        price: values.price,
        ourAdvantage: values.ourAdvantage,
        notes: values.notes,
        createdAt: editingCompetitor?.createdAt || new Date().toISOString(),
      };

      if (editingCompetitor) {
        updateCompetitor(editingCompetitor.id, competitorData);
        message.success('更新成功');
      } else {
        addCompetitor(competitorData);
        message.success('添加成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleExport = () => {
    exportCompetitorsToExcel(competitors);
    message.success('导出成功');
  };

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '竞品名称',
      dataIndex: 'competitorName',
      key: 'competitorName',
    },
    {
      title: '竞品方案',
      dataIndex: 'competitorSolution',
      key: 'competitorSolution',
      ellipsis: true,
    },
    {
      title: '方案弱点',
      dataIndex: 'weaknesses',
      key: 'weaknesses',
      render: (weaknesses: string[]) => (
        <div>
          {weaknesses.map((weakness, index) => (
            <Tag key={index} color="warning" style={{ marginBottom: '4px' }}>
              {weakness}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '价格(万)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price ? `${price}万` : '-',
    },
    {
      title: '我方优势',
      dataIndex: 'ourAdvantage',
      key: 'ourAdvantage',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Competitor) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除该竞品分析吗？"
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
        <h2 style={{ margin: 0 }}>竞品分析</h2>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出分析
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增竞品
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={competitors}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingCompetitor ? '编辑竞品分析' : '新增竞品分析'}
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
            name="competitorName"
            label="竞品名称"
            rules={[{ required: true, message: '请输入竞品名称' }]}
          >
            <Input placeholder="请输入竞品名称" />
          </Form.Item>

          <Form.Item
            name="competitorSolution"
            label="竞品方案"
            rules={[{ required: true, message: '请输入竞品方案' }]}
          >
            <TextArea rows={3} placeholder="请描述竞品的解决方案" />
          </Form.Item>

          <Form.Item
            name="weaknesses"
            label="方案弱点"
            rules={[{ required: true, message: '请输入方案弱点' }]}
          >
            <Select
              mode="tags"
              placeholder="请输入竞品方案的弱点，可添加多个"
            />
          </Form.Item>

          <Form.Item name="price" label="价格(万)">
            <InputNumber
              placeholder="请输入竞品价格"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="ourAdvantage"
            label="我方优势"
            rules={[{ required: true, message: '请输入我方优势' }]}
          >
            <TextArea rows={3} placeholder="请描述我方的竞争优势" />
          </Form.Item>

          <Form.Item name="notes" label="备注">
            <TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Competitors;
