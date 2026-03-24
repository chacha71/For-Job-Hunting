import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Space,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { Template } from '@/types';
import { Customer } from '@/types';

const { Option } = Select;
const { TextArea } = Input;

const Templates: React.FC = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingTemplate(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    form.setFieldsValue(template);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const templateData: Template = {
        id: editingTemplate?.id || `template_${Date.now()}`,
        name: values.name,
        type: values.type,
        description: values.description,
        fields: values.fields,
      };

      if (editingTemplate) {
        updateTemplate(editingTemplate.id, templateData);
        message.success('更新成功');
      } else {
        addTemplate(templateData);
        message.success('添加成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleUseTemplate = (template: Template) => {
    // 触发使用模板的事件，可以跳转到客户管理页面并应用模板
    message.info(`已选择模板：${template.name}，请在客户管理页面使用`);
  };

  const getTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      'government': '政务客户',
      'enterprise': '园区企业',
      'state-owned': '国央企',
    };
    return typeMap[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'government': 'red',
      'enterprise': 'blue',
      'state-owned': 'orange',
    };
    return colorMap[type] || 'default';
  };

  return (
    <div style={{ padding: '24px', marginLeft: '220px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>模板管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增模板
        </Button>
      </div>

      <div style={{ marginBottom: '24px', padding: '16px', background: '#e6f7ff', borderRadius: '6px', border: '1px solid #91d5ff' }}>
        <Space>
          <CheckOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
          <span style={{ color: '#0050b3' }}>
            模板可以帮助您快速录入客户信息，减少重复填写。系统已预置政务、园区、国央企三类客户模板。
          </span>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {templates.map(template => (
          <Col xs={24} md={8} key={template.id}>
            <Card
              title={
                <Space>
                  {template.name}
                  <Tag color={getTypeColor(template.type)}>
                    {getTypeName(template.type)}
                  </Tag>
                </Space>
              }
              extra={
                <Space size="small">
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(template)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除"
                    description="确定要删除该模板吗？"
                    onConfirm={() => handleDelete(template.id)}
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
              }
              actions={[
                <Button
                  type="primary"
                  block
                  icon={<CopyOutlined />}
                  onClick={() => handleUseTemplate(template)}
                >
                  使用模板
                </Button>
              ]}
            >
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {template.description}
                </div>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                  包含字段 ({template.fields.length})
                </div>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {template.fields.map((field, index) => (
                    <Tag
                      key={index}
                      color={field.required ? 'red' : 'default'}
                      style={{ marginBottom: '4px' }}
                    >
                      {field.label}
                      {field.required && '*'}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingTemplate ? '编辑模板' : '新增模板'}
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
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="客户类型"
            rules={[{ required: true, message: '请选择客户类型' }]}
          >
            <Select placeholder="请选择客户类型">
              <Option value="government">政务客户</Option>
              <Option value="enterprise">园区企业</Option>
              <Option value="state-owned">国央企</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="模板描述"
            rules={[{ required: true, message: '请输入模板描述' }]}
          >
            <TextArea rows={2} placeholder="请输入模板描述" />
          </Form.Item>

          <Form.Item label="模板字段">
            <Form.List name="fields">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ marginBottom: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Form.Item
                          {...restField}
                          name={[name, 'label']}
                          label="字段标签"
                          rules={[{ required: true, message: '请输入字段标签' }]}
                        >
                          <Input placeholder="如：客户名称" />
                        </Form.Item>
                        
                        <Form.Item
                          {...restField}
                          name={[name, 'key']}
                          label="字段键值"
                          rules={[{ required: true, message: '请输入字段键值' }]}
                        >
                          <Input placeholder="如：name" />
                        </Form.Item>
                        
                        <Space style={{ width: '100%' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            label="字段类型"
                            rules={[{ required: true, message: '请选择字段类型' }]}
                          >
                            <Select placeholder="请选择类型" style={{ width: '150px' }}>
                              <Option value="input">文本输入</Option>
                              <Option value="select">下拉选择</Option>
                              <Option value="textarea">多行文本</Option>
                              <Option value="date">日期选择</Option>
                              <Option value="number">数字输入</Option>
                              <Option value="tags">标签选择</Option>
                            </Select>
                          </Form.Item>
                          
                          <Form.Item
                            {...restField}
                            name={[name, 'required']}
                            label="是否必填"
                            valuePropName="checked"
                          >
                            <Select style={{ width: '100px' }}>
                              <Option value={true}>是</Option>
                              <Option value={false}>否</Option>
                            </Select>
                          </Form.Item>
                          
                          <Button
                            type="link"
                            danger
                            onClick={() => remove(name)}
                          >
                            删除
                          </Button>
                        </Space>
                      </Space>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加字段
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Templates;
