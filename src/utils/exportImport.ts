import * as XLSX from 'xlsx';
import { Customer, FollowUp, Competitor } from '@/types';
import dayjs from 'dayjs';

/**
 * 导出客户数据到Excel
 */
export function exportCustomersToExcel(customers: Customer[]): void {
  const data = customers.map(c => ({
    '客户名称': c.name,
    '客户类型': getCustomerTypeName(c.type),
    '行业': c.industry,
    '规模': getScaleName(c.scale),
    '年营收(万)': c.annualRevenue || '-',
    '联系人': c.contactPerson,
    '联系电话': c.phone,
    '邮箱': c.email || '-',
    '地址': c.address,
    '状态': getStatusName(c.status),
    '分层': c.tier,
    '标签': c.tags.join(', '),
    '需求': c.requirements.join(', '),
    '备注': c.notes,
    '最后联系': c.lastContactDate ? dayjs(c.lastContactDate).format('YYYY-MM-DD') : '-',
    '下次联系': c.nextContactDate ? dayjs(c.nextContactDate).format('YYYY-MM-DD') : '-',
    '创建时间': dayjs(c.createdAt).format('YYYY-MM-DD HH:mm:ss')
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '客户台账');
  
  const fileName = `客户台账_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * 导出跟进记录到Excel
 */
export function exportFollowUpsToExcel(followUps: FollowUp[]): void {
  const data = followUps.map(f => ({
    '客户名称': f.customerName,
    '跟进日期': dayjs(f.date).format('YYYY-MM-DD'),
    '跟进方式': getFollowUpTypeName(f.type),
    '跟进内容': f.content,
    '跟进结果': getOutcomeName(f.outcome),
    '下一步': f.nextStep || '-',
    '下次日期': f.nextDate ? dayjs(f.nextDate).format('YYYY-MM-DD') : '-',
    '创建人': f.createdBy,
    '创建时间': dayjs(f.createdAt).format('YYYY-MM-DD HH:mm:ss')
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '跟进记录');
  
  const fileName = `跟进记录_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * 导出竞品分析到Excel
 */
export function exportCompetitorsToExcel(competitors: Competitor[]): void {
  const data = competitors.map(c => ({
    '客户名称': c.customerName,
    '竞品名称': c.competitorName,
    '竞品方案': c.competitorSolution,
    '方案弱点': c.weaknesses.join(', '),
    '价格(万)': c.price || '-',
    '我方优势': c.ourAdvantage,
    '备注': c.notes,
    '创建时间': dayjs(c.createdAt).format('YYYY-MM-DD HH:mm:ss')
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '竞品分析');
  
  const fileName = `竞品分析_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * 从Excel导入客户数据
 */
export function importCustomersFromExcel(file: File): Promise<Customer[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const customers: Customer[] = jsonData.map((row: any, index) => ({
          id: `import_${Date.now()}_${index}`,
          name: row['客户名称'] || row['名称'] || '',
          type: parseCustomerType(row['客户类型'] || row['类型']),
          industry: row['行业'] || '',
          scale: parseScale(row['规模']),
          annualRevenue: row['年营收(万)'] || row['年营收'] ? Number(row['年营收(万)'] || row['年营收']) : undefined,
          contactPerson: row['联系人'] || '',
          phone: row['联系电话'] || row['电话'] || '',
          email: row['邮箱'] || '',
          address: row['地址'] || '',
          status: parseStatus(row['状态']),
          tier: parseTier(row['分层'] || row['优先级']),
          tags: (row['标签'] || '').split(',').map((t: string) => t.trim()).filter(Boolean),
          requirements: (row['需求'] || '').split(',').map((r: string) => r.trim()).filter(Boolean),
          notes: row['备注'] || '',
          lastContactDate: row['最后联系'] ? dayjs(row['最后联系']).toISOString() : undefined,
          nextContactDate: row['下次联系'] ? dayjs(row['下次联系']).toISOString() : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        resolve(customers);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}

/**
 * 验证客户数据
 */
export function validateCustomer(customer: Partial<Customer>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!customer.name || customer.name.trim() === '') {
    errors.push('客户名称不能为空');
  }
  
  if (!customer.contactPerson || customer.contactPerson.trim() === '') {
    errors.push('联系人不能为空');
  }
  
  if (!customer.phone || customer.phone.trim() === '') {
    errors.push('联系电话不能为空');
  } else if (!/^1[3-9]\d{9}$/.test(customer.phone)) {
    errors.push('联系电话格式不正确');
  }
  
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    errors.push('邮箱格式不正确');
  }
  
  if (!customer.industry || customer.industry.trim() === '') {
    errors.push('行业不能为空');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// 辅助函数
function getCustomerTypeName(type: string): string {
  const map: Record<string, string> = {
    'government': '政府',
    'enterprise': '企业',
    'state-owned': '国央企',
    'other': '其他'
  };
  return map[type] || type;
}

function getScaleName(scale: string): string {
  const map: Record<string, string> = {
    'large': '大型',
    'medium': '中型',
    'small': '小型'
  };
  return map[scale] || scale;
}

function getStatusName(status: string): string {
  const map: Record<string, string> = {
    'potential': '潜在客户',
    'contacting': '接触中',
    'negotiating': '谈判中',
    'cooperating': '合作中',
    'completed': '已完成'
  };
  return map[status] || status;
}

function getFollowUpTypeName(type: string): string {
  const map: Record<string, string> = {
    'visit': '拜访',
    'call': '电话',
    'email': '邮件',
    'meeting': '会议',
    'other': '其他'
  };
  return map[type] || type;
}

function getOutcomeName(outcome: string): string {
  const map: Record<string, string> = {
    'success': '成功',
    'pending': '进行中',
    'failed': '失败'
  };
  return map[outcome] || outcome;
}

function parseCustomerType(type: string): Customer['type'] {
  const map: Record<string, Customer['type']> = {
    '政府': 'government',
    '企业': 'enterprise',
    '国央企': 'state-owned',
    '其他': 'other'
  };
  return map[type] as Customer['type'] || 'other';
}

function parseScale(scale: string): Customer['scale'] {
  const map: Record<string, Customer['scale']> = {
    '大型': 'large',
    '中型': 'medium',
    '小型': 'small'
  };
  return map[scale] as Customer['scale'] || 'small';
}

function parseStatus(status: string): Customer['status'] {
  const map: Record<string, Customer['status']> = {
    '潜在客户': 'potential',
    '接触中': 'contacting',
    '谈判中': 'negotiating',
    '合作中': 'cooperating',
    '已完成': 'completed'
  };
  return map[status] as Customer['status'] || 'potential';
}

function parseTier(tier: string): Customer['tier'] {
  const map: Record<string, Customer['tier']> = {
    'A': 'A',
    'B': 'B',
    'C': 'C',
    '高': 'A',
    '中': 'B',
    '低': 'C'
  };
  return map[tier] as Customer['tier'] || 'C';
}
