import { formatDefTimeNew } from 'utils/timeUtils';
import { insertComma } from 'utils/commonUtil';

class MotSendLogClass {
  constructor(data) {
    this.event = data?.event ?? '';
    this.eventName = data?.eventName ?? '';
    this.sendMethod = data?.sendMethod ?? [];
    this.expectedCount = this.formatCounts(data?.expectedCount) ?? [];
    this.realCount = this.formatCounts(data?.realCount) ?? [];
    this.openCount = this.formatCounts(data?.openCount) ?? [];
    this.sendDate = data?.sendDate ?? '';
    this.sendTime = data?.sendTime
      ? formatDefTimeNew(new Date(data?.sendTime), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.createTime = data?.createDate
      ? formatDefTimeNew(new Date(data?.createDate), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.createPerson = data?.createName ?? '';
    this.updateTime = data?.alterDate
      ? formatDefTimeNew(new Date(data?.alterDate), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.updatePerson = data?.alterName ?? '';
  }
  formatCounts(counts) {
    // 確保 counts 是一個陣列
    if (!Array.isArray(counts)) return '--';
    return counts.map((count) => {
      if (count === undefined || count === null) {
        // 對於 undefined 或 null 的元素，顯示 '--'
        return '--';
      } else {
        // 對於數字（包括 0），直接顯示該數字
        return count === 0 ? 0 : insertComma(count);
      }
    });
  }
}

export default MotSendLogClass;
