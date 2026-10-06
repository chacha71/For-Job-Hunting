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
              重庆交通大学城乡规划专业 2027 届本科生，大学四年寒暑假深耕电信 ToB 政企销售一线，近期在华为技术有限公司销售管培生岗。华为期间跟进企业购项目、累计 7 场签约覆盖率 98%+，用 AI 搭门店运营工具箱沉淀为标准 SOP、触达 2000+ 人次、间接达成 70 余单。完整走过 ToC 一线推广、ToB 政企运营到门店运营与政企企业购外拓，擅长用数据和呈现把「模糊的需求」变成「清晰的方案」、说服决策者买单。
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
                      <Text strong>华为技术有限公司 · 销售管培生</Text>
                      <div style={{ color: '#999', fontSize: 12 }}>2026.07 – 2026.09</div>
                      <div style={{ color: '#666', fontSize: 13, lineHeight: 1.8 }}>
                        <div>项目落地：深度参与华为基建业务线企业合作项目，重点跟进重庆轨道交通集团上门购，分城市/部门/产品 4 维度分析签约、累计 7 场签约、覆盖率 98%+，梳理企业采购痛点、定制针对性方案</div>
                        <div>门店运营：用 Claude Code 搭门店运营工具箱（高德好评 21 条 + 小红书 10 套内容、防重复机制），获门店采用沉淀为标准 SOP，精准触达 2000+ 人次、间接达成 70 余单</div>
                        <div>需求挖掘：系统梳理全品类产品特点与差异化定位，匹配进店选品和外部展销全链路需求，建立双向选择机制、筛选高净值客群，维护长期客情、挖掘二次转化机会</div>
                        <div>沟通协作：熟悉直营门店线上运营组/培训组/销售外包组协同机制，对接商场管理方，开展外部 B2B 企业客户商务拓展</div>
                      </div>
                    </>
                  ),
                },
                {
                  color: '#9A3B2E',
                  children: (
                    <>
                      <Text strong>襄阳市电信公司 · ToB 政企销售</Text>
                      <div style={{ color: '#999', fontSize: 12 }}>2024 – 2026（寒暑假）</div>
                      <div style={{ color: '#666', fontSize: 13, lineHeight: 1.8 }}>
                        <div>客户拓展：聚焦教育/零售/餐饮等行业，配合团队完成 12 家目标客户需求调研与方案设计，协助签约 8 家新客户</div>
                        <div>数据运营：搭建 ToB 销售数据看板，参与客群画像与获客 ROI 分析，支撑团队超额 8% 完成月度目标</div>
                        <div>产品落地：运用 Claude Code 等协作工具，为客户搭建轻量化办公页面，降低上云门槛</div>
                      </div>
                    </>
                  ),
                },
                {
                  color: '#9A3B2E',
                  children: (
                    <>
                      <Text strong>随州市电信公司 · ToB 政企销售</Text>
                      <div style={{ color: '#999', fontSize: 12 }}>2023 – 2024（寒暑假）</div>
                      <div style={{ color: '#666', fontSize: 13, lineHeight: 1.8 }}>
                        <div>订单交付：深度参与政企大客户经营与项目全流程交付，通过客户画像搭建、跨部门协同与分层运营，实现订单稳定交付与客户价值深挖</div>
                        <div>客户追踪：参与跟进 15 家重点政企客户，搭建客户画像与决策链分析，覆盖从线索挖掘、方案设计到交付全流程</div>
                        <div>沟通协作：参与跨部门协同，配合技术与运维团队推进落地，协助促成 12 笔订单按期交付</div>
                      </div>
                    </>
                  ),
                },
                {
                  color: '#9A3B2E',
                  children: (
                    <>
                      <Text strong>随州市电信公司 · ToC 销售</Text>
                      <div style={{ color: '#999', fontSize: 12 }}>2022 暑期</div>
                      <div style={{ color: '#666', fontSize: 13, lineHeight: 1.8 }}>
                        <div>销售运营：深耕校园与社区线下场景，针对不同客群设计差异化沟通策略，覆盖破冰、需求匹配到成交全链路，累计触达千余名用户</div>
                        <div>订单推广：校园与社区电话卡推广，针对不同场景设计沟通逻辑，累计触达 1000+、订单转化率 90%+</div>
                        <div>客群运营：存量用户全周期维护，响应业务咨询与使用异议，匹配增值服务方案，沉淀口碑转化客群</div>
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
              <Descriptions.Item label="学校">重庆交通大学 · 城乡规划（本科 5 年制）</Descriptions.Item>
              <Descriptions.Item label="GPA">3.94 / 5.0（前 5%）</Descriptions.Item>
              <Descriptions.Item label="荣誉">优秀学生 · 一等奖学金 · 优秀学生代表</Descriptions.Item>
              <Descriptions.Item label="竞赛">互联网+ 国家级二等奖 · 挑战杯 国家级二等奖</Descriptions.Item>
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
