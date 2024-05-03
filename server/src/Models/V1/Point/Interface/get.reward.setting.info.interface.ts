export class GetRewardSettingInfoResp {
  rewardId: string;
  channelId: string;
  rewardName: string;
  startDate: string;
  endDate: string;
  memberShip: string[];
  handselPoint: number;
  activeStatus: number;
  activeDay: number;
  remark: string;
  /** 會員已領取 */
  receivedPoint: number;
  /** 剩餘點數 */
  remainPoint: number;
}
