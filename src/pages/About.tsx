import React from 'react';
import { Card, Row, Col, Timeline, Tag, Avatar, Space, Typography, Descriptions } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  GithubOutlined,
  RocketOutlined,
  BarChartOutlined,
  FileTextOutlined,
  ToolOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About: React.FC = () => {
  const capabilities = [
    {
      icon: <RocketOutlined style={{ fontSize: 28, color: '#9A3B2E' }} />,
      title: 'ToB 销售',
      desc: '需求挖掘、方案撰写、竞品分析、商务跟单、项目推进。跟进过政企大客户与中小微企业两条完全不同的打法。',
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 28, color: '#9A3B2E' }} />,
      title: '商务呈现',
      desc: '擅长政企商务方案与客户汇报 PPT。给老板看的东西，要结构清晰、数据说话、一页抓住重点。',
    },
    {
      icon: <BarChartOutlined style={{ fontSize: 28, color: '#9A3B2E' }} />,
      title: '数据思维',
      desc: '客户分层、决策链分析、ROI 测算。销售不是靠感觉，是靠数据判断「谁值得跟进、投一块赚几块」。',
    },
    {
      icon: <ToolOutlined style={{ fontSize: 28, color: '#9A3B2E' }} />,
      title: 'AI 工具应用',
      desc: '用生成式 AI 和低代码工具提效，把重复劳动交给工具，把精力留给客户。这个作品集本身就是 AI 工具搭出来的。',
    },
  ];

  return (
    <div>
      {/* 顶部个人卡片 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={32} align="middle">
          <Col flex="120px">
            <Avatar size={96} icon={<UserOutlined />} style={{ background: '#9A3B2E' }} />
          </Col>
          <Col flex="auto">
            <Title level={2} style={{ marginBottom: 4 }}>
              王琳菡
            </Title>
            <Space size={8} wrap style={{ marginBottom: 8 }}>
              <Tag color="#9A3B2E">大客户销售 · 渠道销售 · 商业化</Tag>
              <Tag>2027 届应届生</Tag>
              <Tag>可立即到岗 · 3 个月+</Tag>
            </Space>
            <Paragraph style={{ color: '#666', marginBottom: 0, fontSize: 15 }}>
              多年寒暑假深耕电信政企销售一线，近期在华为慧通新零售管培生岗。完整走过从 ToC 一线推广、ToB 政企运营，到门店运营与政企企业购外拓的成长路径。我始终在做的，是帮客户把「模糊的需求」变成「清晰的方案」，再用数据和呈现说服决策者买单。
            </Paragraph>
          </Col>
        </Row>
      </Card>

      {/* 核心能力 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {capabilities.map((cap) => (
          <Col span={6} key={cap.title}>
            <Card hoverable style={{ height: '100%' }}>
              <Space direction="vertical" size={8}>
                {cap.icon}
                <Title level={5} style={{ margin: 0 }}>{cap.title}</Title>
                <Paragraph style={{ color: '#666', fontSize: 13, marginBottom: 0 }}>
                  {cap.desc}
                </Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        {/* 经历时间线 */}
        <Col span={14}>
          <Card title="实习经历" style={{ marginBottom: 16 }}>
            <Timeline
              items={[
                {
                  color: '#9A3B2E',
                  children: (
                    <>
                      <Text strong>华为慧通 · 新零售管培生</Text>
                      <div style={{ color: '#999', fontSize: 12 }}>2026.07 – 2026.08</div>
                      <div style={{ color: '#666', fontSize: 13 }}>
                        政企企业购外拓（轨道交通集团，覆盖 300+ 人）· 门店运营 · 线上口碑运营
                      </div>
                    </>
                  ),
                },
                {
                  color: '#9A3B2E',
                  children: (
                    <>
                      <Text strong>襄阳市电信公司 · ToB 政企销售</Text>
                      <div style={{ color: '#999', fontSize: 12 }}>2024.06 – 2026.03（寒暑假）</div>
                      <div style={{ color: '#666', fontSize: 13 }}>
                        中小微企业上云 · 客户精细化运营 · 数据驱动增长
                      </div>
                    </>
                  ),
                },
                {
                  color: '#9A3B2E',
                  children: (
                    <>
                      <Text strong>随州市电信公司 · ToB 政企销售运营</Text>
                      <div style={{ color: '#999', fontSize: 12 }}>2023.01 – 2024.03（寒暑假）</div>
                      <div style={{ color: '#666', fontSize: 13 }}>
                        政企大客户跟进 · 项目全流程交付
                      </div>
                    </>
                  ),
                },
                {
                  color: '#9A3B2E',
                  children: (
                    <>
                      <Text strong>随州市电信公司 · ToC 销售</Text>
                      <div style={{ color: '#999', fontSize: 12 }}>2022.06 – 2022.09</div>
                      <div style={{ color: '#666', fontSize: 13 }}>
                        校园/社区推广 · 破冰与成交 · 累计触达 1000+
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* 基本信息 + 联系方式 */}
        <Col span={10}>
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="学校">重庆交通大学 · 城乡规划</Descriptions.Item>
              <Descriptions.Item label="学历">本科（5 年制）· 成绩优异</Descriptions.Item>
              <Descriptions.Item label="届别">2027 届应届生</Descriptions.Item>
              <Descriptions.Item label="意向">大客户销售 / 渠道销售 - 商业化</Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="联系方式">
            <Space direction="vertical" size={12}>
              <Space><PhoneOutlined /> 189 0867 6128</Space>
              <Space><MailOutlined /> 6821108@qq.com</Space>
              <Space>
                <GithubOutlined />
                <a href="https://github.com/chacha71" target="_blank" rel="noreferrer">
                  github.com/chacha71
                </a>
              </Space>
              <Space><EnvironmentOutlined /> 北京 · 上海 · 深圳 · 广州</Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default About;
