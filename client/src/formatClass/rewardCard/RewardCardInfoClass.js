import { formatDefTimeNew } from 'utils/timeUtils';
class RewardCardInfoClass {
  constructor(data) {
    const { couponDetails: coupon, rewardCardSettingDetail: info } = data;
    this.rewardCardName = info?.rewardCardName ?? '';
    this.releaseStatus = info?.releaseStatus ? '1' : '0';
    this.mainImageUrl = info?.mainImageUrl ? [info.mainImageUrl] : [];
    this.thumbnailImageUrl = info?.thumbnailImageUrl
      ? [info.thumbnailImageUrl]
      : [];
    this.brandId = info?.brandId ?? '';
    this.rewardCardCategory = info?.rewardCardCategory
      ? `${info?.rewardCardCategory}`
      : '';
    this.maxPoint = info?.maxPoint ? `${info?.maxPoint}` : '';
    this.ruleAmount = info?.ruleAmount ? `${info?.ruleAmount}` : '';
    this.couponDetails = !!coupon?.length
      ? coupon.map(
          ({
            point,
            couponId,
            couponType,
            couponName,
            brandNames,
            releaseStatus,
            redemptionStartDate,
            redemptionEndDate,
            couponRule, // 1: 日期區間, 2: D＋ days
            earliestPickupDate,
            startDate,
            endDate
          }) => ({
            point: `${point}`,
            id: couponId,
            couponType,
            couponName,
            brandNames,
            // brandNames:
            //   brandNames && brandNames.length > 0
            //     ? brandNames.join('、')
            //     : '--',
            releaseStatus,
            redemptionStartDate: redemptionStartDate ?? '',
            redemptionEndDate: redemptionEndDate ?? '',
            couponRule,
            earliestPickupDate,
            startDate,
            endDate
          })
        )
      : [];
    this.isAutoExchange = info?.isAutoExchange ?? '';
    this.startDate = info?.startDate ?? '';
    this.endDate = info?.endDate ?? '';

    this.startDate = info?.startDate ? formatDefTimeNew(info?.startDate) : '';
    this.endDate = info?.endDate ? formatDefTimeNew(info?.endDate) : '';
    this.content = info?.content ?? '';
    this.expirationRule = '1';
  }
}

export default RewardCardInfoClass;
