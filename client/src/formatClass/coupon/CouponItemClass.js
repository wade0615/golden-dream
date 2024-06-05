import couponType from 'constants/couponType';
import couponRule from 'constants/couponRule';
import { insertComma } from 'utils/commonUtil';
import { formatDefTimeNew } from 'utils/timeUtils';

class CouponItemClass {
  constructor(data) {
    this.id = data?.id ?? '';
    this.channel = data?.channelName ?? '';
    this.brand = data?.brandNames ?? '';
    this.type = data?.couponType
      ? Object.values(couponType)[data?.couponType - 1] //1: 優惠券; 2: 商品券
      : '';
    this.rule = data?.rewardRule ? couponRule[data?.rewardRule] : '';
    this.name = data?.couponName ?? '';
    this.url = data?.couponImgUrl ?? '';
    this.points = data?.point ?? '';
    this.releaseState = data?.releaseStatus ?? '';
    this.releaseTime =
      data?.startDate && data?.endDate
        ? `${formatDefTimeNew(data?.startDate)} ~${formatDefTimeNew(
            data?.endDate
          )}`
        : '';
    this.exchangeTime =
      data?.couponRule !== 2
        ? data?.couponStartDate && data?.couponEndDate
          ? `${formatDefTimeNew(data?.couponStartDate)} ~${formatDefTimeNew(
              data?.couponEndDate
            )}`
          : ''
        : `獲得${Object.values(couponType)[data?.couponType - 1]} D+ ${
            data?.earliestPickupDate
          } 天後到期`;
    this.leftCounts = insertComma(data?.lastCount) ?? '';
    this.createTime = data?.createTime
      ? formatDefTimeNew(new Date(data?.createTime), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.createPerson = data?.createName ?? '';
    this.updateTime = data?.alterTime
      ? formatDefTimeNew(new Date(data?.alterTime), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.updatePerson = data?.alterName ?? '';
  }
}

export default CouponItemClass;
