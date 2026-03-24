import { Customer, FollowUp } from '@/types';

/**
 * 腾讯生态集成工具类
 * 包含企业微信、腾讯文档等对接功能
 */

export class TencentIntegration {
  private enterpriseWeChatConfig: {
    corpId: string;
    agentId: string;
    secret: string;
  } | null = null;
  
  private tencentDocConfig: {
    accessToken: string;
  } | null = null;
  
  /**
   * 初始化企业微信配置
   */
  initEnterpriseWeChat(config: { corpId: string; agentId: string; secret: string }) {
    this.enterpriseWeChatConfig = config;
    console.log('企业微信配置已初始化');
  }
  
  /**
   * 初始化腾讯文档配置
   */
  initTencentDoc(config: { accessToken: string }) {
    this.tencentDocConfig = config;
    console.log('腾讯文档配置已初始化');
  }
  
  /**
   * 发送跟进提醒到企业微信
   */
  async sendFollowUpReminder(followUp: FollowUp): Promise<boolean> {
    if (!this.enterpriseWeChatConfig) {
      console.warn('企业微信未配置，无法发送提醒');
      return false;
    }
    
    // 模拟发送企业微信消息
    // 实际应用中需要调用企业微信API
    const message = {
      msgtype: 'text',
      text: {
        content: `【客户跟进提醒】\n客户：${followUp.customerName}\n时间：${new Date(followUp.date).toLocaleDateString()}\n类型：${this.getFollowUpType(followUp.type)}\n内容：${followUp.content}\n请及时跟进！`
      }
    };
    
    console.log('企业微信消息已发送:', message);
    return true;
  }
  
  /**
   * 批量发送跟进提醒
   */
  async batchSendFollowUpReminders(followUps: FollowUp[]): Promise<number> {
    let successCount = 0;
    
    for (const followUp of followUps) {
      const result = await this.sendFollowUpReminder(followUp);
      if (result) successCount++;
    }
    
    return successCount;
  }
  
  /**
   * 导出客户台账到腾讯文档
   */
  async exportToTencentDoc(customers: any[], title: string = '客户台账'): Promise<string> {
    if (!this.tencentDocConfig) {
      console.warn('腾讯文档未配置，无法导出');
      throw new Error('腾讯文档未配置');
    }
    
    // 模拟导出到腾讯文档
    // 实际应用中需要调用腾讯文档API
    const docId = `doc_${Date.now()}`;
    const docUrl = `https://docs.qq.com/sheet/${docId}`;
    
    console.log('导出到腾讯文档成功:', docUrl);
    return docUrl;
  }
  
  /**
   * 导出跟进记录到腾讯文档
   */
  async exportFollowUpsToDoc(followUps: FollowUp[]): Promise<string> {
    if (!this.tencentDocConfig) {
      console.warn('腾讯文档未配置，无法导出');
      throw new Error('腾讯文档未配置');
    }
    
    const title = `跟进记录_${new Date().toISOString().split('T')[0]}`;
    return this.exportToTencentDoc(followUps, title);
  }
  
  /**
   * 一键转发跟进记录给团队成员
   */
  async forwardToTeamMember(followUp: FollowUp, memberIds: string[]): Promise<boolean> {
    if (!this.enterpriseWeChatConfig) {
      console.warn('企业微信未配置，无法转发');
      return false;
    }
    
    // 模拟转发给团队成员
    const message = {
      msgtype: 'text',
      text: {
        content: `【跟进记录分享】\n客户：${followUp.customerName}\n时间：${new Date(followUp.date).toLocaleDateString()}\n内容：${followUp.content}\n结果：${this.getOutcome(followUp.outcome)}\n下一步：${followUp.nextStep || '无'}`
      }
    };
    
    console.log('已转发给团队成员:', memberIds, message);
    return true;
  }
  
  /**
   * 生成协作链接
   */
  generateCollaborationLink(type: 'customer' | 'followUp', id: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${type}/${id}`;
  }
  
  /**
   * 辅助方法：获取跟进类型名称
   */
  private getFollowUpType(type: string): string {
    const map: Record<string, string> = {
      'visit': '拜访',
      'call': '电话',
      'email': '邮件',
      'meeting': '会议',
      'other': '其他'
    };
    return map[type] || type;
  }
  
  /**
   * 辅助方法：获取结果名称
   */
  private getOutcome(outcome: string): string {
    const map: Record<string, string> = {
      'success': '成功',
      'pending': '进行中',
      'failed': '失败'
    };
    return map[outcome] || outcome;
  }
}

// 导出单例实例
export const tencentIntegration = new TencentIntegration();
