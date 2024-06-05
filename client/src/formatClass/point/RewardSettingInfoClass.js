class RewardSettingInfoClass {
  constructor(data) {
    this.rewardId = data.rewardId || '';
    this.rewardName = data.rewardName || '';
    this.startDate = data.startDate || '';
    this.endDate = data.endDate || '';
    this.channelId = data.channelId || [];
    this.memberShip = data.memberShip || [];
    this.handselPoint = data.handselPoint || '';
    this.activeStatus = parseInt(data.activeStatus, 10) || 0;
    this.activeDay = data.activeDay || 1;
    this.remark = data.remark || '';
    this.receivedPoint = data.receivedPoint || '';
    this.remainPoint = data.remainPoint || '';
  }
}

export default RewardSettingInfoClass;
