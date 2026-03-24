import React from 'react';
import { Card, Row, Col, Table, Tag, Progress, Button, Space } from 'antd';
import { ThunderboltOutlined, CopyOutlined } from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { classifyCustomer, batchClassifyCustomers } from '@/utils/customerClassification';

const Analysis: React.FC = () => {
  const { customers } = useStore();
  const classificationResults = batchClassifyCustomers(customers);

  const handleCopyStrategy = (strategy: string) => {
    navigator.clipboard.writeText(strategy);
    alert('策略已复制到剪贴板');
  };

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '年营收',
      dataIndex: 'annualRevenue',
      key: 'annualRevenue',
      render: (revenue: number) => revenue ? `${revenue}万` : '-',
    },
    {
      title: '当前分层',
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
      title: '智能评分',
      key: 'score',
      render: (_: any, record: any) => {
        const result = classificationResults.get(record.id);
        return result ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Progress
              type="circle"
              percent={result.score}
              width={60}
              strokeColor={result.tier === 'A' ? '#ff4d4f' : result.tier === 'B' ? '#faad14' : '#1890ff'}
            />
          </div>
        ) : '-';
      },
    },
    {
      title: '建议分层',
      key: 'recommendedTier',
      render: (_: any, record: any) => {
        const result = classificationResults.get(record.id);
        return result ? (
          <Tag color={result.tier === 'A' ? 'red' : result.tier === 'B' ? 'orange' : 'blue'}>
            {result.tier}级
          </Tag>
        ) : '-';
      },
    },
    {
      title: '跟进策略',
      key: 'strategy',
      ellipsis: true,
      render: (_: any, record: any) => {
        const result = classificationResults.get(record.id);
        return result ? (
          <Space size="small">
            <span style={{ fontSize: '12px', color: '#666' }}>
              {result.strategy.substring(0, 30)}...
            </span>
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopyStrategy(result.strategy)}
            >
              复制
            </Button>
          </Space>
        ) : '-';
      },
    },
    {
      title: '评分明细',
      key: 'details',
      render: (_: any, record: any) => {
        const result = classificationResults.get(record.id);
        return result ? (
          <div style={{ fontSize: '12px' }}>
            <div>收入: {result.factors.revenue}分</div>
            <div>规模: {result.factors.scale}分</div>
            <div>需求: {result.factors.requirements}分</div>
            <div>紧急度: {result.factors.urgency}分</div>
          </div>
        ) : '-';
      },
    },
  ];

  const tierStats = {
    A: Array.from(classificationResults.values()).filter(r => r.tier === 'A').length,
    B: Array.from(classificationResults.values()).filter(r => r.tier === 'B').length,
    C: Array.from(classificationResults.values()).filter(r => r.tier === 'C').length,
  };

  return (
    <div style={{ padding: '24px', marginLeft: '220px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      <h2 style={{ marginBottom: '24px' }}>智能分析</h2>
      
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {tierStats.A}
              </div>
              <div style={{ color: '#666', marginTop: '8px' }}>
                A级高潜客户
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#faad14' }}>
                {tierStats.B}
              </div>
              <div style={{ color: '#666', marginTop: '8px' }}>
                B级重点客户
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1890ff' }}>
                {tierStats.C}
              </div>
              <div style={{ color: '#666', marginTop: '8px' }}>
                C级普通客户
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="客户智能分层与跟进策略">
        <div style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
          <Space>
            <ThunderboltOutlined style={{ color: '#faad14' }} />
            系统基于收入、规模、需求、紧急度等多维度智能评估，自动生成分层建议和跟进策略
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default Analysis;
