import React from 'react';
import { Row, Col, Card, Statistic, Select, Space, DatePicker, Button } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useStore } from '@/store/useStore';

const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const { customers, followUps, getDashboardStats, dashboardFilters, setDashboardFilters } = useStore();
  const stats = getDashboardStats();

  const handleFilterChange = (key: string, value: string | undefined) => {
    setDashboardFilters({ [key]: value });
  };

  const handleReset = () => {
    setDashboardFilters({});
  };

  const tierOption = {
    title: {
      text: '客户分层分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '客户分层',
        type: 'pie',
        radius: '50%',
        data: [
          { value: stats.tierDistribution.A, name: 'A级客户' },
          { value: stats.tierDistribution.B, name: 'B级客户' },
          { value: stats.tierDistribution.C, name: 'C级客户' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const industryOption = {
    title: {
      text: '行业分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: Object.keys(stats.industryDistribution),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '客户数量',
        type: 'bar',
        data: Object.values(stats.industryDistribution),
        itemStyle: {
          color: '#0066FF',
        },
      },
    ],
  };

  const statusOption = {
    title: {
      text: '客户状态分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '客户状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: customers.filter(c => c.status === 'potential').length, name: '潜在客户' },
          { value: customers.filter(c => c.status === 'contacting').length, name: '接触中' },
          { value: customers.filter(c => c.status === 'negotiating').length, name: '谈判中' },
          { value: customers.filter(c => c.status === 'cooperating').length, name: '合作中' },
          { value: customers.filter(c => c.status === 'completed').length, name: '已完成' },
        ],
      },
    ],
  };

  // 跟进进度图表
  const followUpProgressOption = {
    title: {
      text: '跟进进度',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['本周跟进', '本月跟进', '逾期未跟进', '已完成'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '跟进数量',
        type: 'bar',
        data: [
          stats.followUpProgress.thisWeek,
          stats.followUpProgress.thisMonth,
          stats.followUpProgress.overdue,
          stats.followUpProgress.completed
        ],
        itemStyle: {
          color: (params: { dataIndex: number }) => {
            const colors = ['#1890ff', '#52c41a', '#ff4d4f', '#722ed1'];
            return colors[params.dataIndex] || '#1890ff';
          },
        },
      },
    ],
  };

  // 商机漏斗图
  const funnelOption = {
    title: {
      text: '商机漏斗',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}客户',
    },
    series: [
      {
        name: '商机漏斗',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: stats.funnelData.potential || 1,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}: {c}',
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 20,
          },
        },
        data: [
          { value: stats.funnelData.potential, name: '潜在客户', itemStyle: { color: '#faad14' } },
          { value: stats.funnelData.contacting, name: '接触中', itemStyle: { color: '#1890ff' } },
          { value: stats.funnelData.negotiating, name: '谈判中', itemStyle: { color: '#722ed1' } },
          { value: stats.funnelData.cooperating, name: '合作中', itemStyle: { color: '#52c41a' } },
        ],
      },
    ],
  };

  // 规模分布图
  const scaleOption = {
    title: {
      text: '客户规模分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '客户规模',
        type: 'pie',
        radius: '50%',
        data: [
          { value: stats.scaleDistribution.large, name: '大型' },
          { value: stats.scaleDistribution.medium, name: '中型' },
          { value: stats.scaleDistribution.small, name: '小型' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // 区域分布图
  const regionOption = {
    title: {
      text: '区域分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: Object.keys(stats.regionDistribution),
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '客户数量',
        type: 'bar',
        data: Object.values(stats.regionDistribution),
        itemStyle: {
          color: '#13c2c2',
        },
      },
    ],
  };

  const industryOptions = [...new Set(customers.map(c => c.industry))].map(i => ({ value: i, label: i }));
  const scaleOptions = [
    { value: 'large', label: '大型' },
    { value: 'medium', label: '中型' },
    { value: 'small', label: '小型' },
  ];

  return (
    <div style={{ padding: '24px', marginLeft: '220px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      <h2 style={{ marginBottom: '24px' }}>数据看板</h2>
      
      {/* 筛选区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space wrap>
          <FilterOutlined /> 筛选条件：
          <Select
            placeholder="按行业筛选"
            allowClear
            style={{ width: 150 }}
            value={dashboardFilters.industry}
            onChange={(value) => handleFilterChange('industry', value)}
            options={industryOptions}
          />
          <Select
            placeholder="按规模筛选"
            allowClear
            style={{ width: 150 }}
            value={dashboardFilters.scale}
            onChange={(value) => handleFilterChange('scale', value)}
            options={scaleOptions}
          />
          <RangePicker 
            onChange={(dates) => {
              // 日期范围筛选逻辑
            }} 
          />
          <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
        </Space>
      </Card>
      
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="客户总数"
              value={stats.totalCustomers}
              valueStyle={{ color: '#0066FF' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="潜在客户"
              value={stats.potentialCustomers}
              valueStyle={{ color: '#FAAD14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="合作客户"
              value={stats.cooperatingCustomers}
              valueStyle={{ color: '#52C41A' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="本月跟进"
              value={stats.followUpCount}
              valueStyle={{ color: '#722ED1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card title="客户分层分布">
            <ReactECharts option={tierOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="客户状态分布">
            <ReactECharts option={statusOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="行业分布">
            <ReactECharts option={industryOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="跟进进度">
            <ReactECharts option={followUpProgressOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="商机漏斗">
            <ReactECharts option={funnelOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: '24px', marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="客户规模分布">
            <ReactECharts option={scaleOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="区域分布">
            <ReactECharts option={regionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
