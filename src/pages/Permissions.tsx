import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Tag, Tabs, message, Popconfirm, Tree, Row, Col, Statistic, DatePicker, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SafetyOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { User, Role, OperationLog } from '@/types';
import dayjs from 'dayjs';

const { Option } = Select;

const Permissions: React.FC = () => {
  const { users, roles, operationLogs, addUser, updateUser, deleteUser, addRole, updateRole, deleteRole, addOperationLog, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('users');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();

  const roleCodeMap = {
    admin: { text: '管理员', color: 'red' },
    sales: { text: '销售', color: 'blue' },
    operation: { text: '运营', color: 'green' },
  };

  const statusMap = {
    active: { text: '正常', color: 'green' },
    inactive: { text: '禁用', color: 'red' },
  };

  // 权限树数据
  const permissionTreeData = [
    {
      key: 'customer',
      title: '客户管理',
      children: [
        { key: 'customer:view', title: '查看客户' },
        { key: 'customer:create', title: '创建客户' },
        { key: 'customer:edit', title: '编辑客户' },
        { key: 'customer:delete', title: '删除客户' },
        { key: 'customer:export', title: '导出客户' },
      ],
    },
    {
      key: 'followup',
      title: '跟进管理',
      children: [
        { key: 'followup:view', title: '查看跟进' },
        { key: 'followup:create', title: '创建跟进' },
        { key: 'followup:edit', title: '编辑跟进' },
        { key: 'followup:delete', title: '删除跟进' },
      ],
    },
    {
      key: 'activity',
      title: '活动运营',
      children: [
        { key: 'activity:view', title: '查看活动' },
        { key: 'activity:create', title: '创建活动' },
        { key: 'activity:edit', title: '编辑活动' },
        { key: 'activity:delete', title: '删除活动' },
      ],
    },
    {
      key: 'message',
      title: '消息推送',
      children: [
        { key: 'message:view', title: '查看消息' },
        { key: 'message:send', title: '发送消息' },
        { key: 'message:template', title: '管理模板' },
      ],
    },
    {
      key: 'analysis',
      title: '数据分析',
      children: [
        { key: 'analysis:view', title: '查看分析' },
        { key: 'analysis:export', title: '导出报表' },
      ],
    },
    {
      key: 'settings',
      title: '系统设置',
      children: [
        { key: 'settings:view', title: '查看设置' },
        { key: 'settings:edit', title: '编辑设置' },
        { key: 'settings:user', title: '用户管理' },
        { key: 'settings:role', title: '角色管理' },
      ],
    },
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsUserModalOpen(true);
  };

  const handleEditUser = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) {
      message.warning('不能删除当前登录用户');
      return;
    }
    deleteUser(id);
    message.success('删除成功');
  };

  const handleSubmitUser = () => {
    form.validateFields().then(values => {
      const userData: User = {
        ...values,
        id: editingUser?.id || `user_${Date.now()}`,
        createdAt: editingUser?.createdAt || new Date().toISOString(),
      };

      if (editingUser) {
        updateUser(editingUser.id, userData);
        // 记录操作日志
        addOperationLog({
          id: `log_${Date.now()}`,
          userId: currentUser?.id || 'system',
          userName: currentUser?.name || '系统',
          action: '更新用户',
          target: userData.name,
          targetType: 'user',
          details: `更新用户信息：${userData.name}`,
          timestamp: new Date().toISOString(),
        });
        message.success('更新成功');
      } else {
        addUser(userData);
        addOperationLog({
          id: `log_${Date.now()}`,
          userId: currentUser?.id || 'system',
          userName: currentUser?.name || '系统',
          action: '创建用户',
          target: userData.name,
          targetType: 'user',
          details: `创建新用户：${userData.name}`,
          timestamp: new Date().toISOString(),
        });
        message.success('创建成功');
      }
      setIsUserModalOpen(false);
    });
  };

  const handleAddRole = () => {
    setEditingRole(null);
    roleForm.resetFields();
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (record: Role) => {
    setEditingRole(record);
    roleForm.setFieldsValue({
      ...record,
      permissions: record.permissions.includes('*') 
        ? permissionTreeData.map(p => p.key)
        : record.permissions,
    });
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.userCount && role.userCount > 0) {
      message.warning('该角色下有用户，无法删除');
      return;
    }
    deleteRole(id);
    message.success('删除成功');
  };

  const handleSubmitRole = () => {
    roleForm.validateFields().then(values => {
      const permissions: string[] = [];
      if (values.permissions?.includes('*')) {
        permissions.push('*');
      } else {
        values.permissions?.forEach((key: string) => {
          if (permissionTreeData.find(p => p.key === key)) {
            // 选择父节点时，自动包含所有子权限
            const parent = permissionTreeData.find(p => p.key === key);
            parent?.children?.forEach(c => permissions.push(c.key));
          } else {
            permissions.push(key);
          }
        });
      }

      const roleData: Role = {
        ...values,
        permissions,
        id: editingRole?.id || `role_${Date.now()}`,
        userCount: editingRole?.userCount || 0,
      };

      if (editingRole) {
        updateRole(editingRole.id, roleData);
        message.success('更新成功');
      } else {
        addRole(roleData);
        message.success('创建成功');
      }
      setIsRoleModalOpen(false);
    });
  };

  const userColumns = [
    {
      title: '用户',
      key: 'user',
      render: (_: any, record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <div>
            <div>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: keyof typeof roleCodeMap) => (
        <Tag color={roleCodeMap[role]?.color}>{roleCodeMap[role]?.text}</Tag>
      ),
    },
    {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof statusMap) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditUser(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDeleteUser(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const roleColumns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Role) => (
        <Space>
          <SafetyOutlined style={{ fontSize: '18px', color: record.code === 'admin' ? '#ff4d4f' : '#1890ff' }} />
          {name}
        </Space>
      ),
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      render: (code: keyof typeof roleCodeMap) => (
        <Tag>{code}</Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '权限',
      key: 'permissions',
      render: (_: any, record: Role) => (
        <Tag color={record.permissions.includes('*') ? 'red' : 'blue'}>
          {record.permissions.includes('*') ? '全部权限' : `${record.permissions.length} 项权限`}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space>
          <Button type="link" icon={<SettingOutlined />} onClick={() => handleEditRole(record)}>配置权限</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDeleteRole(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const logColumns = [
    {
      title: '操作人',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => <Tag color="blue">{action}</Tag>,
    },
    {
      title: '对象',
      dataIndex: 'target',
      key: 'target',
    },
    {
      title: '类型',
      dataIndex: 'targetType',
      key: 'targetType',
      render: (type: string) => {
        const map: Record<string, string> = {
          customer: '客户',
          followup: '跟进',
          activity: '活动',
          message: '消息',
          user: '用户',
          settings: '设置',
        };
        return map[type] || type;
      },
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  // 统计数据
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalRoles = roles.length;

  return (
    <div style={{ padding: '24px', marginLeft: '220px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      <h2 style={{ marginBottom: '24px' }}>权限管理</h2>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="用户总数" value={totalUsers} valueStyle={{ color: '#1890ff' }} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="在职用户" value={activeUsers} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="角色数量" value={totalRoles} valueStyle={{ color: '#722ed1' }} prefix={<SafetyOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'users',
              label: '用户管理',
              children: (
                <>
                  <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
                      添加用户
                    </Button>
                  </Space>
                  <Table
                    columns={userColumns}
                    dataSource={users}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
            {
              key: 'roles',
              label: '角色管理',
              children: (
                <>
                  <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>
                      添加角色
                    </Button>
                  </Space>
                  <Table
                    columns={roleColumns}
                    dataSource={roles}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
            {
              key: 'logs',
              label: '操作日志',
              children: (
                <>
                  <Space style={{ marginBottom: 16 }}>
                    <DatePicker.RangePicker />
                    <Select placeholder="操作类型" style={{ width: 150 }} allowClear>
                      <Option value="create">创建</Option>
                      <Option value="update">更新</Option>
                      <Option value="delete">删除</Option>
                    </Select>
                  </Space>
                  <Table
                    columns={logColumns}
                    dataSource={operationLogs}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* 用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isUserModalOpen}
        onOk={handleSubmitUser}
        onCancel={() => setIsUserModalOpen(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input disabled={!!editingUser} />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select>
              {roles.map(r => (
                <Option key={r.id} value={r.code}>{r.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="手机">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '添加角色'}
        open={isRoleModalOpen}
        onOk={handleSubmitRole}
        onCancel={() => setIsRoleModalOpen(false)}
        width={500}
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="角色编码" rules={[{ required: true }]} disabled={!!editingRole}>
            <Select>
              <Option value="admin">admin - 管理员</Option>
              <Option value="sales">sales - 销售</Option>
              <Option value="operation">operation - 运营</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="permissions" label="权限配置">
            <Tree
              checkable
              defaultExpandAll
              treeData={permissionTreeData.map(p => ({
                ...p,
                children: p.children?.map(c => ({ key: c.key, title: c.title })),
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Permissions;
