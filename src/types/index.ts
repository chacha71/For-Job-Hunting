export interface Customer {
  id: string;
  name: string;
  type: 'government' | 'enterprise' | 'state-owned' | 'other';
  industry: string;
  scale: 'large' | 'medium' | 'small';
  annualRevenue?: number;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: 'potential' | 'contacting' | 'negotiating' | 'cooperating' | 'completed';
  tier: 'A' | 'B' | 'C';
  tags: string[];
  requirements: string[];
  notes: string;
  lastContactDate?: string;
  nextContactDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  type: 'visit' | 'call' | 'email' | 'meeting' | 'other';
  content: string;
  outcome: 'success' | 'pending' | 'failed';
  nextStep?: string;
  nextDate?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
}

export interface Competitor {
  id: string;
  customerId: string;
  customerName: string;
  competitorName: string;
  competitorSolution: string;
  weaknesses: string[];
  price?: number;
  ourAdvantage: string;
  notes: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  category: 'requirement' | 'solution' | 'industry' | 'other';
  color: string;
  solutionTemplate?: string;
}

export interface Template {
  id: string;
  name: string;
  type: 'government' | 'enterprise' | 'state-owned';
  fields: TemplateField[];
  description: string;
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'date' | 'number' | 'tags';
  required: boolean;
  options?: string[];
}

export interface DashboardStats {
  totalCustomers: number;
  potentialCustomers: number;
  cooperatingCustomers: number;
  monthlyRevenue: number;
  followUpCount: number;
  tierDistribution: {
    A: number;
    B: number;
    C: number;
  };
  industryDistribution: Record<string, number>;
  regionDistribution: Record<string, number>;
  scaleDistribution: Record<string, number>;
  followUpProgress: {
    thisWeek: number;
    thisMonth: number;
    overdue: number;
    completed: number;
  };
  funnelData: {
    potential: number;
    contacting: number;
    negotiating: number;
    cooperating: number;
  };
}

// 用户与角色
export type UserRole = 'admin' | 'sales' | 'operation';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  category: 'customer' | 'followup' | 'activity' | 'message' | 'settings' | 'analysis';
}

export interface Role {
  id: string;
  name: string;
  code: UserRole;
  description: string;
  permissions: string[];
  userCount: number;
}

// 操作日志
export interface OperationLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  targetType: 'customer' | 'followup' | 'activity' | 'message' | 'user' | 'settings';
  details: string;
  ip?: string;
  timestamp: string;
}

// 活动运营
export type ActivityStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
export type ActivityType = 'seminar' | 'exhibition' | 'meeting' | 'training' | 'online' | 'other';

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  status: ActivityStatus;
  maxParticipants?: number;
  registrations: ActivityRegistration[];
  leads: Lead[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRegistration {
  id: string;
  activityId: string;
  customerId?: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  company?: string;
  position?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  registeredAt: string;
  notes?: string;
}

export interface Lead {
  id: string;
  activityId: string;
  source: 'activity' | 'web' | 'referral' | 'phone' | 'other';
  name: string;
  phone: string;
  email?: string;
  company?: string;
  position?: string;
  requirement?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: string;
  createdAt: string;
  convertedToCustomerId?: string;
}

// 消息推送
export type MessageChannel = 'sms' | 'email' | 'app';
export type MessageType = 'followup_reminder' | 'customer_notify' | 'activity_notification' | 'custom';
export type MessageStatus = 'pending' | 'sent' | 'failed' | 'read';

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageChannel;
  type: MessageType;
  title?: string;
  content: string;
  variables: string[];
  createdBy: string;
  createdAt: string;
}

export interface Message {
  id: string;
  templateId?: string;
  channel: MessageChannel;
  type: MessageType;
  recipientId: string;
  recipientName: string;
  recipientPhone?: string;
  recipientWechat?: string;
  title?: string;
  content: string;
  status: MessageStatus;
  sentAt?: string;
  readAt?: string;
  errorMessage?: string;
  createdBy: string;
  createdAt: string;
}

export interface MessageCampaign {
  id: string;
  name: string;
  description: string;
  channel: MessageChannel;
  templateId?: string;
  targetType: 'all' | 'tier' | 'industry' | 'custom';
  targetFilters?: {
    tiers?: ('A' | 'B' | 'C')[];
    industries?: string[];
    customerIds?: string[];
  };
  scheduledAt?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  totalCount: number;
  sentCount: number;
  failedCount: number;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}
