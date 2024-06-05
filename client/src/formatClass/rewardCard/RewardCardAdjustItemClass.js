import { formatDefTimeNew } from 'utils/timeUtils';

const _type = {
  ASSIGN: '指定會員',
  IMPORT: '批量匯入'
};

class RewardCardAdjustItemClass {
  constructor(data) {
    this.id = data?.risId ?? '';
    this.risName = data?.risName ?? '';
    this.member = data?.memberType ? _type[data?.memberType] : '--';
    this.risType = data?.risType === 1 ? '增點' : '扣點';
    this.risDate = data?.risDate ? formatDefTimeNew(data?.risDate) : '';
    this.createTime = data?.createTime
      ? formatDefTimeNew(data?.createTime, { formatString: 'yyyy/MM/dd HH:mm' })
      : '';
    this.createName = data?.createName ?? '';
    this.alterTime = data?.alterTime
      ? formatDefTimeNew(data?.alterTime, { formatString: 'yyyy/MM/dd HH:mm' })
      : '';
    this.alterName = data?.alterName ?? '';
    this.rewardPoint =
      data?.rewardPoint !== 0
        ? Number.parseInt(data?.rewardPoint)
        : '依批量匯入調整';
  }
}

export default RewardCardAdjustItemClass;
