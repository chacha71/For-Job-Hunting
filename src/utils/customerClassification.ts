import { Customer } from '@/types';

export interface ClassificationResult {
  tier: 'A' | 'B' | 'C';
  score: number;
  factors: {
    revenue: number;
    scale: number;
    requirements: number;
    urgency: number;
  };
  strategy: string;
}

/**
 * 客户智能分层算法
 * 基于收入、规模、需求、紧急度等多个维度进行综合评分
 */
export function classifyCustomer(customer: Customer): ClassificationResult {
  let score = 0;
  
  // 收入维度 (0-30分)
  const revenueScore = calculateRevenueScore(customer);
  score += revenueScore;
  
  // 规模维度 (0-25分)
  const scaleScore = calculateScaleScore(customer);
  score += scaleScore;
  
  // 需求维度 (0-25分)
  const requirementsScore = calculateRequirementsScore(customer);
  score += requirementsScore;
  
  // 紧急度维度 (0-20分)
  const urgencyScore = calculateUrgencyScore(customer);
  score += urgencyScore;
  
  // 确定分层
  let tier: 'A' | 'B' | 'C';
  if (score >= 70) {
    tier = 'A';
  } else if (score >= 40) {
    tier = 'B';
  } else {
    tier = 'C';
  }
  
  // 跟进策略
  const strategy = getFollowUpStrategy(tier, score, customer);
  
  return {
    tier,
    score,
    factors: {
      revenue: revenueScore,
      scale: scaleScore,
      requirements: requirementsScore,
      urgency: urgencyScore
    },
    strategy
  };
}

function calculateRevenueScore(customer: Customer): number {
  if (!customer.annualRevenue) return 0;
  
  const revenue = customer.annualRevenue;
  if (revenue >= 5000) return 30;
  if (revenue >= 2000) return 25;
  if (revenue >= 1000) return 20;
  if (revenue >= 500) return 15;
  if (revenue >= 200) return 10;
  return 5;
}

function calculateScaleScore(customer: Customer): number {
  const scaleMap = {
    large: 25,
    medium: 15,
    small: 5
  };
  return scaleMap[customer.scale];
}

function calculateRequirementsScore(customer: Customer): number {
  const requirementsCount = customer.requirements.length;
  
  if (requirementsCount >= 5) return 25;
  if (requirementsCount >= 4) return 20;
  if (requirementsCount >= 3) return 15;
  if (requirementsCount >= 2) return 10;
  if (requirementsCount >= 1) return 5;
  return 0;
}

function calculateUrgencyScore(customer: Customer): number {
  // 基于客户状态评估紧急度
  const statusMap = {
    potential: 5,
    contacting: 10,
    negotiating: 20,
    cooperating: 5,
    completed: 0
  };
  
  let score = statusMap[customer.status];
  
  // 有明确的下次跟进日期，紧急度更高
  if (customer.nextContactDate) {
    const nextDate = new Date(customer.nextContactDate);
    const now = new Date();
    const daysDiff = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 3) score += 5;
    else if (daysDiff <= 7) score += 3;
  }
  
  return Math.min(score, 20);
}

function getFollowUpStrategy(tier: 'A' | 'B' | 'C', score: number, customer: Customer): string {
  const strategies: Record<'A' | 'B' | 'C', string[]> = {
    A: [
      '每周至少一次深入拜访',
      '定期提供定制化解决方案',
      '建立高层直接沟通渠道',
      '优先安排资源支持',
      '建立专属服务团队'
    ],
    B: [
      '双周一次跟进沟通',
      '定期发送行业动态和方案',
      '参与客户重要会议',
      '协助解决技术问题',
      '建立长期合作预期'
    ],
    C: [
      '每月一次定期沟通',
      '保持基础服务和关怀',
      '收集潜在需求信息',
      '关注业务发展动态',
      '等待合适时机推进'
    ]
  };
  
  // 根据客户类型添加特定策略
  let typeSpecificStrategy = '';
  if (customer.type === 'government') {
    typeSpecificStrategy = '\n\n政企专项：关注政策导向，配合政府采购周期，提供合规方案';
  } else if (customer.type === 'state-owned') {
    typeSpecificStrategy = '\n\n国央企专项：关注数字化转型重点，提供国企特色解决方案，对接集团资源';
  }
  
  return strategies[tier].join('、') + typeSpecificStrategy;
}

/**
 * 批量智能分层
 */
export function batchClassifyCustomers(customers: Customer[]): Map<string, ClassificationResult> {
  const results = new Map<string, ClassificationResult>();
  
  customers.forEach(customer => {
    const result = classifyCustomer(customer);
    results.set(customer.id, result);
  });
  
  return results;
}
