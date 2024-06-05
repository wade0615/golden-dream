import { formatDefTimeNew } from 'utils/timeUtils';

class RewardCardSettingItemClass {
  constructor(data) {
    this.id = data?.rewardCardId ?? '';
    this.rewardCardName = data?.rewardCardName ?? '';
    this.brandName = data?.brandName ?? '';
    this.thumbnailImage = data?.thumbnailImage ?? '';
    this.releaseStatus = data?.releaseStatus ?? '';
    this.periodDate = `${formatDefTimeNew(new Date(data?.startDate ?? ''), {
      isStart: true,
      formatString: 'yyyy/MM/dd HH:mm'
    })} ~${formatDefTimeNew(new Date(data?.endDate ?? ''), {
      isStart: false,
      formatString: 'yyyy/MM/dd HH:mm'
    })}`;
    this.createTime = data?.createTime
      ? formatDefTimeNew(new Date(data?.createTime), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.createName = data?.createName ?? '';
    this.alterTime = data?.alterTime
      ? formatDefTimeNew(new Date(data?.alterTime), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.alterName = data?.alterName ?? '';
  }
}

export default RewardCardSettingItemClass;
