import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Drawer,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { Tag as TagType } from '@/types';

const { Option } = Select;
const { TextArea } = Input;

const Tags: React.FC = () => {
  const { tags, addTag, updateTag, deleteTag } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
    form.setFieldsValue(tag);
    setIsModalVisible(true);
  };

  const handleView = (tag: TagType) => {
    setSelectedTag(tag);
    setIsDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteTag(id);
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const tagData: TagType = {
        id: editingTag?.id || `tag_${Date.now()}`,
        name: values.name,
        category: values.category,
        color: values.color,
        solutionTemplate: values.solutionTemplate,
      };

      if (editingTag) {
        updateTag(editingTag.id, tagData);
        message.success('更新成功');
      } else {
        addTag(tagData);
        message.success('添加成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleUseTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
    message.success('方案模板已复制到剪贴板');
  };

  const colorOptions = [
    { label: '蓝色', value: '#1890ff' },
    { label: '绿色', value: '#52c41a' },
    { label: '黄色', value: '#faad14' },
    { label: '红色', value: '#f5222d' },
    { label: '紫色', value: '#722ed1' },
    { label: '粉色', value: '#eb2f96' },
    { label: '橙色', value: '#fa541c' },
    { label: '青色', value: '#13c2c2' },
  ];

  const columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TagType) => (
        <Tag color={record.color}>{name}</Tag>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const categoryMap: Record<string, string> = {
          'requirement': '需求标签',
          'solution': '方案标签',
          'industry': '行业标签',
          'other': '其他'
        };
        return categoryMap[category];
      },
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: color,
          borderRadius: '4px',
          display: 'inline-block'
        }} />
      ),
    },
    {
      title: '方案模板',
      dataIndex: 'solutionTemplate',
      key: 'solutionTemplate',
      ellipsis: true,
      render: (template: string) => template ? template.substring(0, 30) + '...' : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TagType) => (
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
          <Popconfirm
            title="确认删除"
            description="确定要删除该标签吗？"
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
        <h2 style={{ margin: 0 }}>需求标签库</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增标签
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTag ? '编辑标签' : '新增标签'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>

          <Form.Item
            name="category"
            label="类别"
            rules={[{ required: true, message: '请选择类别' }]}
          >
            <Select placeholder="请选择类别">
              <Option value="requirement">需求标签</Option>
              <Option value="solution">方案标签</Option>
              <Option value="industry">行业标签</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="color"
            label="颜色"
            rules={[{ required: true, message: '请选择颜色' }]}
          >
            <Select placeholder="请选择颜色">
              {colorOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    backgroundColor: opt.value,
                    marginRight: '8px',
                    borderRadius: '2px'
                  }} />
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="solutionTemplate" label="方案模板">
            <TextArea
              rows={4}
              placeholder="请输入方案模板，用于快速生成解决方案"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="标签详情"
        placement="right"
        width={500}
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
      >
        {selectedTag && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Tag color={selectedTag.color} style={{ fontSize: '16px', padding: '4px 12px' }}>
                {selectedTag.name}
              </Tag>
            </div>
            <p><strong>类别：</strong>
              {selectedTag.category === 'requirement' ? '需求标签' :
               selectedTag.category === 'solution' ? '方案标签' :
               selectedTag.category === 'industry' ? '行业标签' : '其他'}
            </p>
            <p><strong>颜色：</strong>
              <span style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                backgroundColor: selectedTag.color,
                borderRadius: '4px',
                verticalAlign: 'middle',
                marginLeft: '8px'
              }} />
            </p>
            <p><strong>方案模板：</strong></p>
            <div style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '4px',
              marginTop: '8px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {selectedTag.solutionTemplate || '暂无方案模板'}
            </div>
            {selectedTag.solutionTemplate && (
              <Button
                type="primary"
                style={{ marginTop: '16px' }}
                onClick={() => handleUseTemplate(selectedTag.solutionTemplate!)}
              >
                使用模板
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Tags;
