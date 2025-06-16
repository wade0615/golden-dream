import { Injectable } from '@nestjs/common';

interface MessageLimit {
  count: number;
  lastReset: Date;
}

interface IpLimit {
  [ip: string]: MessageLimit;
}

@Injectable()
export class GlobalVariableService {
  private messageLimits: IpLimit = {};

  // 檢查是否需要重置計數器
  private checkAndResetCounter(ip: string): void {
    const now = new Date();
    const ipLimit = this.messageLimits[ip];

    if (!ipLimit) {
      this.messageLimits[ip] = {
        count: 0,
        lastReset: now
      };
      return;
    }

    // 檢查是否是新的一天
    const lastReset = ipLimit.lastReset;
    if (
      now.getDate() !== lastReset.getDate() ||
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear()
    ) {
      this.messageLimits[ip] = {
        count: 0,
        lastReset: now
      };
    }
  }

  // 檢查並增加訊息計數
  canSendMessage(ip: string): boolean {
    this.checkAndResetCounter(ip);

    const ipLimit = this.messageLimits[ip];
    if (ipLimit.count >= 10) {
      return false;
    }

    ipLimit.count++;
    return true;
  }

  // 獲取 IP 當前的訊息計數
  getMessageCount(ip: string): number {
    this.checkAndResetCounter(ip);
    return this.messageLimits[ip].count;
  }

  // 清理過期數據
  private cleanupOldData(): void {
    const now = new Date();
    Object.keys(this.messageLimits).forEach(ip => {
      const ipLimit = this.messageLimits[ip];
      if (
        now.getDate() !== ipLimit.lastReset.getDate() ||
        now.getMonth() !== ipLimit.lastReset.getMonth() ||
        now.getFullYear() !== ipLimit.lastReset.getFullYear()
      ) {
        delete this.messageLimits[ip];
      }
    });
  }

  constructor() {
    // 每天凌晨執行清理
    setInterval(() => {
      this.cleanupOldData();
    }, 24 * 60 * 60 * 1000);
  }
}