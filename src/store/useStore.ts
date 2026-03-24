import { create } from 'zustand';
import { Customer, FollowUp, Competitor, Tag, Template, DashboardStats, User, Role, OperationLog, Activity, ActivityRegistration, Lead, MessageTemplate, Message, MessageCampaign } from '@/types';

interface StoreState {
  customers: Customer[];
  followUps: FollowUp[];
  competitors: Competitor[];
  tags: Tag[];
  templates: Template[];
  currentCustomer: Customer | null;
  
  // 用户与权限
  currentUser: User | null;
  users: User[];
  roles: Role[];
  permissions: string[];
  
  // 操作日志
  operationLogs: OperationLog[];
  
  // 活动运营
  activities: Activity[];
  leads: Lead[];
  
  // 消息推送
  messageTemplates: MessageTemplate[];
  messages: Message[];
  messageCampaigns: MessageCampaign[];
  
  // 仪表盘筛选
  dashboardFilters: {
    industry?: string;
    region?: string;
    scale?: string;
  };
  
  // 客户操作
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  setCurrentCustomer: (customer: Customer | null) => void;
  
  // 跟进记录操作
  addFollowUp: (followUp: FollowUp) => void;
  updateFollowUp: (id: string, followUp: Partial<FollowUp>) => void;
  deleteFollowUp: (id: string) => void;
  
  // 竞品分析操作
  addCompetitor: (competitor: Competitor) => void;
  updateCompetitor: (id: string, competitor: Partial<Competitor>) => void;
  deleteCompetitor: (id: string) => void;
  
  // 标签操作
  addTag: (tag: Tag) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  // 模板操作
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, template: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  
  // 批量导入
  batchImportCustomers: (customers: Customer[]) => void;
  
  // 用户与权限操作
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setUserPermissions: (permissions: string[]) => void;
  
  // 角色操作
  addRole: (role: Role) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  
  // 操作日志
  addOperationLog: (log: OperationLog) => void;
  getOperationLogs: (filters?: { userId?: string; targetType?: string; startDate?: string; endDate?: string }) => OperationLog[];
  
  // 活动操作
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  addRegistration: (activityId: string, registration: ActivityRegistration) => void;
  
  // 线索操作
  addLead: (lead: Lead) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLeadToCustomer: (leadId: string) => void;
  
  // 消息模板操作
  addMessageTemplate: (template: MessageTemplate) => void;
  updateMessageTemplate: (id: string, template: Partial<MessageTemplate>) => void;
  deleteMessageTemplate: (id: string) => void;
  
  // 消息操作
  addMessage: (message: Message) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  
  // 消息群发操作
  addMessageCampaign: (campaign: MessageCampaign) => void;
  updateMessageCampaign: (id: string, campaign: Partial<MessageCampaign>) => void;
  deleteMessageCampaign: (id: string) => void;
  
  // 仪表盘筛选
  setDashboardFilters: (filters: Partial<StoreState['dashboardFilters']>) => void;
  
  // 计算统计数据
  getDashboardStats: () => DashboardStats;
}

export const useStore = create<StoreState>((set, get) => ({
  customers: [
    {
      id: 'c1',
      name: '北京市政务服务管理局',
      type: 'government',
      industry: '政府',
      scale: 'large',
      annualRevenue: 5000,
      contactPerson: '张主任',
      phone: '010-12345678',
      email: 'zhang@beijing.gov.cn',
      address: '北京市东城区正义路2号',
      status: 'cooperating',
      tier: 'A',
      tags: ['智慧政务', '信息化改造'],
      requirements: ['政务服务一体化平台', '数据共享交换'],
      notes: '长期合作客户，年度合同已签订',
      lastContactDate: '2026-03-20',
      nextContactDate: '2026-04-15',
      createdAt: '2025-01-15',
      updatedAt: '2026-03-20'
    },
    {
      id: 'c2',
      name: '华东理工大学',
      type: 'government',
      industry: '教育',
      scale: 'large',
      annualRevenue: 3000,
      contactPerson: '李老师',
      phone: '021-87654321',
      email: 'li@ecust.edu.cn',
      address: '上海市梅陇路130号',
      status: 'negotiating',
      tier: 'A',
      tags: ['校园网建设', '智慧校园'],
      requirements: ['校园网升级改造', '智慧教室建设'],
      notes: '预算已批复，预计下月签约',
      lastContactDate: '2026-03-18',
      nextContactDate: '2026-04-01',
      createdAt: '2025-06-20',
      updatedAt: '2026-03-18'
    },
    {
      id: 'c3',
      name: '中国石化集团',
      type: 'state-owned',
      industry: '能源',
      scale: 'large',
      annualRevenue: 8000,
      contactPerson: '王经理',
      phone: '010-11112222',
      email: 'wang@sinopec.com',
      address: '北京市朝阳区朝阳门北大街22号',
      status: 'contacting',
      tier: 'A',
      tags: ['上云服务', '数字化转型'],
      requirements: ['云平台建设', '数据中心整合'],
      notes: '大型央企数字化转型项目',
      lastContactDate: '2026-03-15',
      nextContactDate: '2026-03-28',
      createdAt: '2026-02-10',
      updatedAt: '2026-03-15'
    },
    {
      id: 'c4',
      name: '深圳高新技术产业园',
      type: 'enterprise',
      industry: '科技',
      scale: 'large',
      annualRevenue: 6000,
      contactPerson: '赵总监',
      phone: '0755-88886666',
      email: 'zhao@szhi-tech.com',
      address: '深圳市南山区科技园南区',
      status: 'cooperating',
      tier: 'A',
      tags: ['园区数字化', '智慧安防'],
      requirements: ['园区管理系统', '智能安防系统'],
      notes: '年度服务合同执行中',
      lastContactDate: '2026-03-22',
      nextContactDate: '2026-04-10',
      createdAt: '2024-11-05',
      updatedAt: '2026-03-22'
    },
    {
      id: 'c5',
      name: '浙江省卫生健康委员会',
      type: 'government',
      industry: '医疗',
      scale: 'large',
      annualRevenue: 4000,
      contactPerson: '陈处长',
      phone: '0571-12345678',
      email: 'chen@zj.gov.cn',
      address: '杭州市省府路8号',
      status: 'negotiating',
      tier: 'B',
      tags: ['智慧医疗', '健康大数据'],
      requirements: ['医疗大数据平台', '区域健康信息平台'],
      notes: '省级医疗信息化项目',
      lastContactDate: '2026-03-19',
      nextContactDate: '2026-04-05',
      createdAt: '2026-01-20',
      updatedAt: '2026-03-19'
    },
    {
      id: 'c6',
      name: '广州汽车集团股份有限公司',
      type: 'enterprise',
      industry: '制造',
      scale: 'large',
      annualRevenue: 10000,
      contactPerson: '刘部长',
      phone: '020-12345678',
      email: 'liu@gac.com.cn',
      address: '广州市天河区珠江新城',
      status: 'potential',
      tier: 'B',
      tags: ['上云服务', '智能制造'],
      requirements: ['工厂数字化', '工业互联网'],
      notes: '新开拓客户，需求刚明确',
      lastContactDate: '2026-03-21',
      nextContactDate: '2026-04-08',
      createdAt: '2026-03-21',
      updatedAt: '2026-03-21'
    },
    {
      id: 'c7',
      name: '上海市交通委员会',
      type: 'government',
      industry: '交通',
      scale: 'large',
      annualRevenue: 3500,
      contactPerson: '周科长',
      phone: '021-22223333',
      email: 'zhou@shjt.gov.cn',
      address: '上海市浦东新区世博大道',
      status: 'contacting',
      tier: 'B',
      tags: ['智慧交通', '信息化改造'],
      requirements: ['交通信号系统', '智能公交系统'],
      notes: '智慧交通示范项目',
      lastContactDate: '2026-03-17',
      nextContactDate: '2026-03-30',
      createdAt: '2026-02-28',
      updatedAt: '2026-03-17'
    },
    {
      id: 'c8',
      name: '华为技术有限公司',
      type: 'enterprise',
      industry: 'IT',
      scale: 'large',
      annualRevenue: 15000,
      contactPerson: '孙经理',
      phone: '0755-28780888',
      email: 'sun@huawei.com',
      address: '深圳市龙岗区坂田华为基地',
      status: 'cooperating',
      tier: 'A',
      tags: ['国央企转型', '数字化转型'],
      requirements: ['企业数字化咨询', 'IT运维服务'],
      notes: '战略合作伙伴',
      lastContactDate: '2026-03-23',
      nextContactDate: '2026-04-20',
      createdAt: '2024-08-15',
      updatedAt: '2026-03-23'
    },
    {
      id: 'c9',
      name: '江苏省教育厅',
      type: 'government',
      industry: '教育',
      scale: 'large',
      annualRevenue: 2500,
      contactPerson: '吴处长',
      phone: '025-12345678',
      email: 'wu@ec.js.gov.cn',
      address: '南京市北京西路15号',
      status: 'potential',
      tier: 'B',
      tags: ['智慧教育', '校园网建设'],
      requirements: ['教育云平台', '智慧校园'],
      notes: '省级教育信息化项目规划中',
      lastContactDate: '2026-03-10',
      nextContactDate: '2026-04-15',
      createdAt: '2026-03-10',
      updatedAt: '2026-03-10'
    },
    {
      id: 'c10',
      name: '中国平安保险集团',
      type: 'state-owned',
      industry: '金融',
      scale: 'large',
      annualRevenue: 12000,
      contactPerson: '郑总监',
      phone: '0755-88888888',
      email: 'zheng@pingan.com.cn',
      address: '深圳市福田区益田路5033号',
      status: 'negotiating',
      tier: 'A',
      tags: ['上云服务', '金融科技'],
      requirements: ['保险业务上云', 'AI客服系统'],
      notes: '金融行业合规要求高',
      lastContactDate: '2026-03-16',
      nextContactDate: '2026-04-02',
      createdAt: '2025-12-01',
      updatedAt: '2026-03-16'
    },
    {
      id: 'c11',
      name: '杭州市第一人民医院',
      type: 'government',
      industry: '医疗',
      scale: 'medium',
      annualRevenue: 1500,
      contactPerson: '冯主任',
      phone: '0571-87065701',
      email: 'feng@hz1h.com',
      address: '杭州市上城区孝女路2号',
      status: 'cooperating',
      tier: 'B',
      tags: ['智慧医疗'],
      requirements: ['医院信息系统', '远程诊疗平台'],
      notes: '已签约年度服务',
      lastContactDate: '2026-03-20',
      nextContactDate: '2026-04-18',
      createdAt: '2025-09-10',
      updatedAt: '2026-03-20'
    },
    {
      id: 'c12',
      name: '浙江大学',
      type: 'government',
      industry: '教育',
      scale: 'large',
      annualRevenue: 4500,
      contactPerson: '何教授',
      phone: '0571-87951000',
      email: 'he@zju.edu.cn',
      address: '杭州市余杭塘路866号',
      status: 'contacting',
      tier: 'A',
      tags: ['智慧校园', '校园网建设', '上云服务'],
      requirements: ['超算中心建设', '云服务平台'],
      notes: '高校信息化标杆项目',
      lastContactDate: '2026-03-22',
      nextContactDate: '2026-04-05',
      createdAt: '2026-01-15',
      updatedAt: '2026-03-22'
    }
  ],
  followUps: [
    {
      id: 'f1',
      customerId: 'c1',
      customerName: '北京市政务服务管理局',
      date: '2026-03-20',
      type: 'meeting',
      content: '汇报一季度项目进展，确认二期需求',
      outcome: 'success',
      nextStep: '准备二期建设方案',
      nextDate: '2026-04-15',
      createdBy: '1',
      createdAt: '2026-03-20T10:00:00Z'
    },
    {
      id: 'f2',
      customerId: 'c2',
      customerName: '华东理工大学',
      date: '2026-03-18',
      type: 'visit',
      content: '现场考察校园网络环境，沟通需求细节',
      outcome: 'success',
      nextStep: '提交技术方案和报价',
      nextDate: '2026-04-01',
      createdBy: '1',
      createdAt: '2026-03-18T14:30:00Z'
    },
    {
      id: 'f3',
      customerId: 'c3',
      customerName: '中国石化集团',
      date: '2026-03-15',
      type: 'meeting',
      content: '初步沟通云平台建设需求',
      outcome: 'pending',
      nextStep: '安排技术团队对接',
      nextDate: '2026-03-28',
      createdBy: '2',
      createdAt: '2026-03-15T09:00:00Z'
    },
    {
      id: 'f4',
      customerId: 'c4',
      customerName: '深圳高新技术产业园',
      date: '2026-03-22',
      type: 'call',
      content: '回访满意度，确认续约意向',
      outcome: 'success',
      nextStep: '续约合同准备',
      nextDate: '2026-04-10',
      createdBy: '1',
      createdAt: '2026-03-22T16:00:00Z'
    },
    {
      id: 'f5',
      customerId: 'c5',
      customerName: '浙江省卫生健康委员会',
      date: '2026-03-19',
      type: 'meeting',
      content: '省级医疗大数据平台方案评审',
      outcome: 'pending',
      nextStep: '根据反馈修改方案',
      nextDate: '2026-04-05',
      createdBy: '1',
      createdAt: '2026-03-19T11:00:00Z'
    },
    {
      id: 'f6',
      customerId: 'c6',
      customerName: '广州汽车集团股份有限公司',
      date: '2026-03-21',
      type: 'visit',
      content: '首次拜访，介绍公司业务和案例',
      outcome: 'success',
      nextStep: '提供案例资料和初步方案',
      nextDate: '2026-04-08',
      createdBy: '2',
      createdAt: '2026-03-21T10:30:00Z'
    },
    {
      id: 'f7',
      customerId: 'c8',
      customerName: '华为技术有限公司',
      date: '2026-03-23',
      type: 'meeting',
      content: '季度业务回顾，探讨新合作领域',
      outcome: 'success',
      nextStep: '制定年度合作计划',
      nextDate: '2026-04-20',
      createdBy: '1',
      createdAt: '2026-03-23T14:00:00Z'
    },
    {
      id: 'f8',
      customerId: 'c10',
      customerName: '中国平安保险集团',
      date: '2026-03-16',
      type: 'meeting',
      content: '保险业务上云需求讨论',
      outcome: 'pending',
      nextStep: '提供金融行业合规方案',
      nextDate: '2026-04-02',
      createdBy: '1',
      createdAt: '2026-03-16T15:00:00Z'
    }
  ],
  competitors: [
    {
      id: 'comp1',
      customerId: 'c1',
      customerName: '北京市政务服务管理局',
      competitorName: '阿里云',
      competitorSolution: '政务云整体解决方案',
      weaknesses: ['本地化服务能力不足', '价格较高'],
      price: 4500,
      ourAdvantage: '政务行业经验丰富，安全合规资质齐全',
      notes: '客户倾向于选择有政务背景的供应商',
      createdAt: '2026-02-15'
    },
    {
      id: 'comp2',
      customerId: 'c2',
      customerName: '华东理工大学',
      competitorName: '华为',
      competitorSolution: '智慧校园全栈方案',
      weaknesses: ['高校案例较少', '实施周期长'],
      price: 2800,
      ourAdvantage: '高校合作案例多，熟悉教育行业需求',
      notes: '已在高校市场建立口碑',
      createdAt: '2026-03-10'
    },
    {
      id: 'comp3',
      customerId: 'c3',
      customerName: '中国石化集团',
      competitorName: '腾讯云',
      competitorSolution: '企业云服务',
      weaknesses: ['工业互联网经验不足'],
      price: 7500,
      ourAdvantage: '有能源行业案例，了解石化业务流程',
      notes: '需要展示能源行业成功案例',
      createdAt: '2026-03-01'
    }
  ],
  tags: [
    {
      id: '1',
      name: '校园网建设',
      category: 'requirement',
      color: '#1890ff',
      solutionTemplate: '提供校园网整体解决方案，包含网络架构、安全防护、运维管理'
    },
    {
      id: '2',
      name: '信息化改造',
      category: 'requirement',
      color: '#52c41a',
      solutionTemplate: '提供信息化改造方案，包含数字化办公、数据中台建设'
    },
    {
      id: '3',
      name: '上云服务',
      category: 'requirement',
      color: '#faad14',
      solutionTemplate: '提供云计算迁移方案，包含云架构设计、迁移实施、运维服务'
    },
    {
      id: '4',
      name: '智慧政务',
      category: 'solution',
      color: '#722ed1',
      solutionTemplate: '智慧政务一体化解决方案'
    },
    {
      id: '5',
      name: '园区数字化',
      category: 'solution',
      color: '#eb2f96',
      solutionTemplate: '智慧园区数字化运营平台'
    },
    {
      id: '6',
      name: '国央企转型',
      category: 'solution',
      color: '#fa541c',
      solutionTemplate: '国有企业数字化转型综合方案'
    }
  ],
  templates: [
    {
      id: '1',
      name: '政务客户模板',
      type: 'government',
      description: '适用于政府部门、事业单位',
      fields: [
        { key: 'name', label: '客户名称', type: 'input', required: true },
        { key: 'type', label: '客户类型', type: 'select', required: true, options: ['government', 'enterprise', 'state-owned', 'other'] },
        { key: 'contactPerson', label: '联系人', type: 'input', required: true },
        { key: 'phone', label: '联系电话', type: 'input', required: true },
        { key: 'industry', label: '行业', type: 'select', required: true, options: ['政府', '教育', '医疗', '交通', '其他'] },
        { key: 'scale', label: '规模', type: 'select', required: true, options: ['large', 'medium', 'small'] },
        { key: 'address', label: '地址', type: 'input', required: false }
      ]
    },
    {
      id: '2',
      name: '园区企业模板',
      type: 'enterprise',
      description: '适用于各类园区企业',
      fields: [
        { key: 'name', label: '企业名称', type: 'input', required: true },
        { key: 'type', label: '企业类型', type: 'select', required: true, options: ['government', 'enterprise', 'state-owned', 'other'] },
        { key: 'contactPerson', label: '联系人', type: 'input', required: true },
        { key: 'phone', label: '联系电话', type: 'input', required: true },
        { key: 'industry', label: '行业', type: 'select', required: true, options: ['制造', 'IT', '金融', '服务业', '其他'] },
        { key: 'scale', label: '规模', type: 'select', required: true, options: ['large', 'medium', 'small'] },
        { key: 'annualRevenue', label: '年营收(万)', type: 'number', required: false },
        { key: 'address', label: '地址', type: 'input', required: false }
      ]
    },
    {
      id: '3',
      name: '国央企模板',
      type: 'state-owned',
      description: '适用于国有企业和央企',
      fields: [
        { key: 'name', label: '企业名称', type: 'input', required: true },
        { key: 'type', label: '企业性质', type: 'select', required: true, options: ['government', 'enterprise', 'state-owned', 'other'] },
        { key: 'contactPerson', label: '联系人', type: 'input', required: true },
        { key: 'phone', label: '联系电话', type: 'input', required: true },
        { key: 'email', label: '邮箱', type: 'input', required: true },
        { key: 'industry', label: '行业', type: 'select', required: true, options: ['能源', '交通', '通信', '制造', '金融', '其他'] },
        { key: 'scale', label: '规模', type: 'select', required: true, options: ['large', 'medium', 'small'] },
        { key: 'annualRevenue', label: '年营收(万)', type: 'number', required: true },
        { key: 'address', label: '地址', type: 'input', required: false }
      ]
    }
  ],
  currentCustomer: null,
  
  // 用户与权限初始化
  currentUser: {
    id: '1',
    username: 'admin',
    name: '系统管理员',
    role: 'admin',
    phone: '13800138000',
    email: 'admin@company.com',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  users: [
    {
      id: '1',
      username: 'admin',
      name: '系统管理员',
      role: 'admin',
      phone: '13800138000',
      email: 'admin@company.com',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    {
      id: '2',
      username: 'sales1',
      name: '张三',
      role: 'sales',
      phone: '13800138001',
      email: 'zhangsan@company.com',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      username: 'operation1',
      name: '李四',
      role: 'operation',
      phone: '13800138002',
      email: 'lisi@company.com',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  roles: [
    {
      id: '1',
      name: '管理员',
      code: 'admin',
      description: '拥有所有系统权限',
      permissions: ['*'],
      userCount: 1
    },
    {
      id: '2',
      name: '销售',
      code: 'sales',
      description: '负责客户管理和跟进',
      permissions: ['customer:*', 'followup:*', 'activity:view', 'message:send', 'analysis:view'],
      userCount: 1
    },
    {
      id: '3',
      name: '运营',
      code: 'operation',
      description: '负责活动运营和数据分析',
      permissions: ['activity:*', 'message:*', 'analysis:*', 'customer:view', 'followup:view'],
      userCount: 1
    }
  ],
  permissions: ['*'],
  
  // 操作日志
  operationLogs: [],
  
  // 活动运营初始化
  activities: [
    {
      id: 'act1',
      name: '2026年政企数字化转型高峰论坛',
      type: 'offline',
      status: 'ongoing',
      description: '邀请各行业政企客户参加数字化转型主题论坛',
      startDate: '2026-04-15',
      endDate: '2026-04-16',
      location: '北京国际会议中心',
      targetAudience: '政府领导、企业高管',
      expectedCount: 200,
      budget: 500000,
      registrations: [
        { id: 'r1', name: '张主任', company: '北京市政务服务管理局', phone: '13800138001', status: 'registered', registeredAt: '2026-03-20' },
        { id: 'r2', name: '李老师', company: '华东理工大学', phone: '13800138002', status: 'registered', registeredAt: '2026-03-21' },
        { id: 'r3', name: '王经理', company: '中国石化集团', phone: '13800138003', status: 'pending', registeredAt: '2026-03-22' }
      ],
      createdBy: '1',
      createdAt: '2026-03-01',
      updatedAt: '2026-03-22'
    },
    {
      id: 'act2',
      name: '智慧校园解决方案分享会',
      type: 'offline',
      status: 'planning',
      description: '针对教育行业客户的智慧校园解决方案分享',
      startDate: '2026-05-10',
      endDate: '2026-05-10',
      location: '上海张江高科园区',
      targetAudience: '高校信息化负责人',
      expectedCount: 50,
      budget: 80000,
      registrations: [],
      createdBy: '1',
      createdAt: '2026-03-15',
      updatedAt: '2026-03-15'
    },
    {
      id: 'act3',
      name: '企业上云实战训练营',
      type: 'online',
      status: 'completed',
      description: '线上直播课程，讲解企业上云最佳实践',
      startDate: '2026-03-01',
      endDate: '2026-03-05',
      location: '线上直播',
      targetAudience: '企业IT负责人',
      expectedCount: 500,
      budget: 30000,
      registrations: [
        { id: 'r4', name: '刘部长', company: '广州汽车集团股份有限公司', phone: '13800138004', status: 'registered', registeredAt: '2026-02-28' }
      ],
      createdBy: '2',
      createdAt: '2026-02-15',
      updatedAt: '2026-03-05'
    }
  ],
  leads: [
    {
      id: 'lead1',
      name: '周先生',
      phone: '13900139001',
      email: 'zhou@techcorp.com',
      company: '科技创新有限公司',
      position: 'IT总监',
      source: '官网注册',
      status: 'new',
      requirement: '企业数字化转型咨询',
      assignedTo: '1',
      convertedToCustomerId: undefined,
      createdAt: '2026-03-20',
      updatedAt: '2026-03-20'
    },
    {
      id: 'lead2',
      name: '吴女士',
      phone: '13900139002',
      email: 'wu@smartcity.gov.cn',
      company: '某市政府信息中心',
      position: '主任',
      source: '活动邀约',
      status: 'contacted',
      requirement: '智慧城市整体规划',
      assignedTo: '1',
      convertedToCustomerId: undefined,
      createdAt: '2026-03-18',
      updatedAt: '2026-03-19'
    },
    {
      id: 'lead3',
      name: '郑先生',
      phone: '13900139003',
      email: 'zheng@finance.com',
      company: '金融科技有限公司',
      position: '总经理',
      source: '客户推荐',
      status: 'qualified',
      requirement: '金融云平台建设',
      assignedTo: '1',
      convertedToCustomerId: undefined,
      createdAt: '2026-03-15',
      updatedAt: '2026-03-20'
    },
    {
      id: 'lead4',
      name: '王女士',
      phone: '13900139004',
      email: 'wang@hospital.com',
      company: '某三甲医院',
      position: '信息科主任',
      source: '展会获取',
      status: 'new',
      requirement: '医院信息化系统升级',
      assignedTo: '2',
      convertedToCustomerId: undefined,
      createdAt: '2026-03-22',
      updatedAt: '2026-03-22'
    }
  ],
  
  // 消息推送初始化
  messageTemplates: [
    {
      id: '1',
      name: '跟进提醒',
      channel: 'sms',
      type: 'followup_reminder',
      title: '客户跟进提醒',
      content: '尊敬的{{name}}，您有客户{{customerName}}需要跟进，最后联系日期：{{lastContactDate}}，请及时处理。',
      variables: ['name', 'customerName', 'lastContactDate'],
      createdBy: '1',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: '活动通知',
      channel: 'email',
      type: 'activity_notification',
      title: '活动邀请',
      content: '尊敬的{{name}}，诚邀您参加{{activityName}}，活动时间：{{startDate}}，地点：{{location}}。',
      variables: ['name', 'activityName', 'startDate', 'location'],
      createdBy: '1',
      createdAt: new Date().toISOString()
    }
  ],
  messages: [],
  messageCampaigns: [
    {
      id: 'mc1',
      name: '一季度客户回访通知',
      templateId: '1',
      channel: 'sms',
      targetCustomers: ['c1', 'c2', 'c4', 'c8'],
      status: 'completed',
      scheduledAt: '2026-03-15T09:00:00Z',
      sentAt: '2026-03-15T09:00:15Z',
      successCount: 4,
      failCount: 0,
      createdBy: '1',
      createdAt: '2026-03-14'
    },
    {
      id: 'mc2',
      name: '活动邀请函发送',
      templateId: '2',
      channel: 'email',
      targetCustomers: ['c1', 'c2', 'c3', 'c5', 'c6', 'c7', 'c9', 'c10'],
      status: 'sending',
      scheduledAt: '2026-03-25T10:00:00Z',
      sentAt: undefined,
      successCount: 0,
      failCount: 0,
      createdBy: '1',
      createdAt: '2026-03-20'
    },
    {
      id: 'mc3',
      name: '新产品发布通知',
      templateId: '1',
      channel: 'sms',
      targetCustomers: ['c1', 'c4', 'c8', 'c11'],
      status: 'draft',
      scheduledAt: undefined,
      sentAt: undefined,
      successCount: 0,
      failCount: 0,
      createdBy: '2',
      createdAt: '2026-03-22'
    }
  ],
  
  // 仪表盘筛选
  dashboardFilters: {},
  
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  
  updateCustomer: (id, customer) => set((state) => ({
    customers: state.customers.map((c) => c.id === id ? { ...c, ...customer, updatedAt: new Date().toISOString() } : c)
  })),
  
  deleteCustomer: (id) => set((state) => ({
    customers: state.customers.filter((c) => c.id !== id)
  })),
  
  setCurrentCustomer: (customer) => set({ currentCustomer: customer }),
  
  addFollowUp: (followUp) => set((state) => ({ followUps: [...state.followUps, followUp] })),
  
  updateFollowUp: (id, followUp) => set((state) => ({
    followUps: state.followUps.map((f) => f.id === id ? { ...f, ...followUp } : f)
  })),
  
  deleteFollowUp: (id) => set((state) => ({
    followUps: state.followUps.filter((f) => f.id !== id)
  })),
  
  addCompetitor: (competitor) => set((state) => ({ competitors: [...state.competitors, competitor] })),
  
  updateCompetitor: (id, competitor) => set((state) => ({
    competitors: state.competitors.map((c) => c.id === id ? { ...c, ...competitor } : c)
  })),
  
  deleteCompetitor: (id) => set((state) => ({
    competitors: state.competitors.filter((c) => c.id !== id)
  })),
  
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  
  updateTag: (id, tag) => set((state) => ({
    tags: state.tags.map((t) => t.id === id ? { ...t, ...tag } : t)
  })),
  
  deleteTag: (id) => set((state) => ({
    tags: state.tags.filter((t) => t.id !== id)
  })),
  
  addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),
  
  updateTemplate: (id, template) => set((state) => ({
    templates: state.templates.map((t) => t.id === id ? { ...t, ...template } : t)
  })),
  
  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter((t) => t.id !== id)
  })),
  
  batchImportCustomers: (customers) => set((state) => ({ customers: [...state.customers, ...customers] })),
  
  getDashboardStats: () => {
    const { customers, followUps, dashboardFilters } = get();
    
    // 应用筛选条件
    let filteredCustomers = customers;
    if (dashboardFilters.industry) {
      filteredCustomers = filteredCustomers.filter(c => c.industry === dashboardFilters.industry);
    }
    if (dashboardFilters.scale) {
      filteredCustomers = filteredCustomers.filter(c => c.scale === dashboardFilters.scale);
    }
    // 区域筛选（如果客户有region字段）
    
    const totalCustomers = filteredCustomers.length;
    const potentialCustomers = filteredCustomers.filter(c => c.status === 'potential').length;
    const cooperatingCustomers = filteredCustomers.filter(c => c.status === 'cooperating').length;
    const monthlyRevenue = filteredCustomers.filter(c => c.status === 'cooperating').reduce((sum, c) => sum + (c.annualRevenue || 0), 0) / 12;
    const followUpCount = followUps.filter(f => {
      const followUpDate = new Date(f.date);
      const now = new Date();
      return followUpDate.getMonth() === now.getMonth() && followUpDate.getFullYear() === now.getFullYear();
    }).length;
    
    const tierDistribution = {
      A: filteredCustomers.filter(c => c.tier === 'A').length,
      B: filteredCustomers.filter(c => c.tier === 'B').length,
      C: filteredCustomers.filter(c => c.tier === 'C').length
    };
    
    const industryDistribution: Record<string, number> = {};
    filteredCustomers.forEach(c => {
      industryDistribution[c.industry] = (industryDistribution[c.industry] || 0) + 1;
    });
    
    const regionDistribution: Record<string, number> = {};
    // 默认区域分布（可后续扩展）
    filteredCustomers.forEach(c => {
      const region = c.address?.substring(0, c.address.indexOf('市')) || '其他';
      regionDistribution[region] = (regionDistribution[region] || 0) + 1;
    });
    
    const scaleDistribution: Record<string, number> = {
      large: filteredCustomers.filter(c => c.scale === 'large').length,
      medium: filteredCustomers.filter(c => c.scale === 'medium').length,
      small: filteredCustomers.filter(c => c.scale === 'small').length
    };
    
    // 跟进进度
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekFollowUps = followUps.filter(f => new Date(f.date) >= oneWeekAgo).length;
    const thisMonthFollowUps = followUps.filter(f => {
      const followUpDate = new Date(f.date);
      return followUpDate.getMonth() === now.getMonth() && followUpDate.getFullYear() === now.getFullYear();
    }).length;
    const overdueFollowUps = filteredCustomers.filter(c => {
      if (!c.nextContactDate) return false;
      return new Date(c.nextContactDate) < now;
    }).length;
    const completedFollowUps = followUps.filter(f => f.outcome === 'success').length;
    
    // 商机漏斗
    const funnelData = {
      potential: filteredCustomers.filter(c => c.status === 'potential').length,
      contacting: filteredCustomers.filter(c => c.status === 'contacting').length,
      negotiating: filteredCustomers.filter(c => c.status === 'negotiating').length,
      cooperating: filteredCustomers.filter(c => c.status === 'cooperating').length
    };
    
    return {
      totalCustomers,
      potentialCustomers,
      cooperatingCustomers,
      monthlyRevenue,
      followUpCount,
      tierDistribution,
      industryDistribution,
      regionDistribution,
      scaleDistribution,
      followUpProgress: {
        thisWeek: thisWeekFollowUps,
        thisMonth: thisMonthFollowUps,
        overdue: overdueFollowUps,
        completed: completedFollowUps
      },
      funnelData
    };
  },
  
  // 用户与权限
  setCurrentUser: (user) => set({ currentUser: user }),
  
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  
  updateUser: (id, user) => set((state) => ({
    users: state.users.map((u) => u.id === id ? { ...u, ...user } : u)
  })),
  
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id)
  })),
  
  setUserPermissions: (permissions) => set({ permissions }),
  
  // 角色操作
  addRole: (role) => set((state) => ({ roles: [...state.roles, role] })),
  
  updateRole: (id, role) => set((state) => ({
    roles: state.roles.map((r) => r.id === id ? { ...r, ...role } : r)
  })),
  
  deleteRole: (id) => set((state) => ({
    roles: state.roles.filter((r) => r.id !== id)
  })),
  
  // 操作日志
  addOperationLog: (log) => set((state) => ({ operationLogs: [log, ...state.operationLogs] })),
  
  getOperationLogs: (filters) => {
    const { operationLogs } = get();
    let filtered = operationLogs;
    if (filters?.userId) {
      filtered = filtered.filter(l => l.userId === filters.userId);
    }
    if (filters?.targetType) {
      filtered = filtered.filter(l => l.targetType === filters.targetType);
    }
    if (filters?.startDate) {
      filtered = filtered.filter(l => l.timestamp >= filters.startDate!);
    }
    if (filters?.endDate) {
      filtered = filtered.filter(l => l.timestamp <= filters.endDate!);
    }
    return filtered;
  },
  
  // 活动操作
  addActivity: (activity) => set((state) => ({ activities: [...state.activities, activity] })),
  
  updateActivity: (id, activity) => set((state) => ({
    activities: state.activities.map((a) => a.id === id ? { ...a, ...activity, updatedAt: new Date().toISOString() } : a)
  })),
  
  deleteActivity: (id) => set((state) => ({
    activities: state.activities.filter((a) => a.id !== id)
  })),
  
  addRegistration: (activityId, registration) => set((state) => ({
    activities: state.activities.map((a) => 
      a.id === activityId 
        ? { ...a, registrations: [...a.registrations, registration] }
        : a
    )
  })),
  
  // 线索操作
  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  
  updateLead: (id, lead) => set((state) => ({
    leads: state.leads.map((l) => l.id === id ? { ...l, ...lead } : l)
  })),
  
  deleteLead: (id) => set((state) => ({
    leads: state.leads.filter((l) => l.id !== id)
  })),
  
  convertLeadToCustomer: (leadId) => {
    const { leads, addCustomer } = get();
    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.status === 'qualified') {
      const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        name: lead.name,
        type: 'enterprise',
        industry: lead.company || '其他',
        scale: 'medium',
        contactPerson: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        address: '',
        status: 'potential',
        tier: 'C',
        tags: [],
        requirements: lead.requirement ? [lead.requirement] : [],
        notes: `由线索转化，来源活动`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      addCustomer(newCustomer);
      get().updateLead(leadId, { convertedToCustomerId: newCustomer.id, status: 'converted' });
    }
  },
  
  // 消息模板操作
  addMessageTemplate: (template) => set((state) => ({ messageTemplates: [...state.messageTemplates, template] })),
  
  updateMessageTemplate: (id, template) => set((state) => ({
    messageTemplates: state.messageTemplates.map((t) => t.id === id ? { ...t, ...template } : t)
  })),
  
  deleteMessageTemplate: (id) => set((state) => ({
    messageTemplates: state.messageTemplates.filter((t) => t.id !== id)
  })),
  
  // 消息操作
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  
  updateMessage: (id, message) => set((state) => ({
    messages: state.messages.map((m) => m.id === id ? { ...m, ...message } : m)
  })),
  
  // 消息群发操作
  addMessageCampaign: (campaign) => set((state) => ({ messageCampaigns: [...state.messageCampaigns, campaign] })),
  
  updateMessageCampaign: (id, campaign) => set((state) => ({
    messageCampaigns: state.messageCampaigns.map((c) => c.id === id ? { ...c, ...campaign } : c)
  })),
  
  deleteMessageCampaign: (id) => set((state) => ({
    messageCampaigns: state.messageCampaigns.filter((c) => c.id !== id)
  })),
  
  // 仪表盘筛选
  setDashboardFilters: (filters) => set((state) => ({
    dashboardFilters: { ...state.dashboardFilters, ...filters }
  }))
}));
