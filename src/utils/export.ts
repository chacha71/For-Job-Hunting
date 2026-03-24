import * as XLSX from 'xlsx';
import { User } from '@/types';

/**
 * 添加水印到Excel工作表
 */
export const addWatermarkToSheet = (ws: XLSX.WorkSheet, user: User | null): void => {
  if (!user) return;

  const watermarkText = `导出人：${user.name} | 角色：${user.role} | 时间：${new Date().toLocaleString()}`;
  
  // 在第一行添加水印信息
  const watermarkRow = XLSX.utils.aoa_to_sheet([[watermarkText]]);
  
  // 设置水印行样式
  if (watermarkRow['!ref']) {
    const range = XLSX.utils.decode_range(watermarkRow['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (watermarkRow[cellAddress]) {
          watermarkRow[cellAddress].s = {
            font: { color: { rgb: 'CCCCCC' }, sz: 9 },
            alignment: { horizontal: 'left' }
          };
        }
      }
    }
  }
};

/**
 * 导出客户数据到Excel（带水印）
 */
export const exportCustomersWithWatermark = (
  customers: any[],
  user: User | null,
  filename: string = '客户数据'
): void => {
  // 准备数据
  const exportData = customers.map(c => ({
    '客户名称': c.name,
    '客户类型': c.type === 'government' ? '政府' : c.type === 'enterprise' ? '企业' : c.type === 'state-owned' ? '国央企' : '其他',
    '行业': c.industry,
    '规模': c.scale === 'large' ? '大型' : c.scale === 'medium' ? '中型' : '小型',
    '年营收(万)': c.annualRevenue,
    '联系人': c.contactPerson,
    '电话': c.phone,
    '邮箱': c.email,
    '地址': c.address,
    '客户状态': c.status === 'potential' ? '潜在客户' : c.status === 'contacting' ? '接触中' : c.status === 'negotiating' ? '谈判中' : c.status === 'cooperating' ? '合作中' : '已完成',
    '客户分层': c.tier === 'A' ? 'A级' : c.tier === 'B' ? 'B级' : 'C级',
    '标签': c.tags?.join(', '),
    '需求': c.requirements?.join(', '),
    '最后联系日期': c.lastContactDate,
    '下次联系日期': c.nextContactDate,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // 添加水印
  addWatermarkToSheet(ws, user);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '客户数据');
  
  // 生成带时间戳的文件名
  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
};

/**
 * 导出跟进记录到Excel（带水印）
 */
export const exportFollowUpsWithWatermark = (
  followUps: any[],
  user: User | null,
  filename: string = '跟进记录'
): void => {
  const exportData = followUps.map(f => ({
    '客户名称': f.customerName,
    '跟进日期': f.date,
    '跟进方式': f.type === 'visit' ? '拜访' : f.type === 'call' ? '电话' : f.type === 'email' ? '邮件' : f.type === 'meeting' ? '会议' : '其他',
    '跟进内容': f.content,
    '跟进结果': f.outcome === 'success' ? '成功' : f.outcome === 'pending' ? '待定' : '失败',
    '下一步计划': f.nextStep,
    '计划日期': f.nextDate,
    '创建人': f.createdBy,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  addWatermarkToSheet(ws, user);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '跟进记录');
  
  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
};

/**
 * 导出活动数据到Excel（带水印）
 */
export const exportActivitiesWithWatermark = (
  activities: any[],
  user: User | null,
  filename: string = '活动数据'
): void => {
  const exportData = activities.map(a => ({
    '活动名称': a.name,
    '活动类型': a.type,
    '开始时间': a.startDate,
    '结束时间': a.endDate,
    '地点': a.location,
    '主办方': a.organizer,
    '状态': a.status,
    '最大参与人数': a.maxParticipants,
    '报名人数': a.registrations?.length || 0,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  addWatermarkToSheet(ws, user);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '活动数据');
  
  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
};

/**
 * 导出线索数据到Excel（带水印）
 */
export const exportLeadsWithWatermark = (
  leads: any[],
  user: User | null,
  filename: string = '线索数据'
): void => {
  const exportData = leads.map(l => ({
    '姓名': l.name,
    '电话': l.phone,
    '邮箱': l.email,
    '公司': l.company,
    '职位': l.position,
    '来源': l.source,
    '需求': l.requirement,
    '状态': l.status,
    '创建时间': l.createdAt,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  addWatermarkToSheet(ws, user);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '线索数据');
  
  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
};
