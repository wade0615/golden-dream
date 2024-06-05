import { formatDefTimeNew } from 'utils/timeUtils';
class CouponInfoClass {
  constructor(data) {
    const { couponDetail, memberShips, brands, stores } = data;
    this.couponName = couponDetail?.couponName ?? '';
    this.birthMonth = couponDetail?.birthdayMonth
      ? Number(couponDetail?.birthdayMonth).toString()
      : '';
    this.birthYear = couponDetail?.birthdayYear ?? '';
    this.brand = brands?.map((brand) => ({
      label: brand.brandName,
      value: brand.brandId,
      isOnly: brand.isCorporation
    }));
    this.store = !stores.length ? '1' : '2';
    this.channel = couponDetail?.assignChannelId ?? '';
    this.rule = couponDetail?.rewardRule ?? '';
    this.description = couponDetail?.description ?? '';
    this.startDate = couponDetail?.startDate
      ? formatDefTimeNew(couponDetail?.startDate)
      : '';
    this.endDate = couponDetail?.endDate
      ? formatDefTimeNew(couponDetail?.endDate)
      : '';
    this.exchangeRadio = couponDetail?.couponRule
      ? couponDetail?.couponRule.toString()
      : '';
    this.exchangeStartDate = couponDetail?.couponStartDate
      ? formatDefTimeNew(couponDetail?.couponStartDate)
      : '';
    this.exchangeEndDate = couponDetail?.couponEndDate
      ? formatDefTimeNew(couponDetail?.couponEndDate)
      : '';
    this.Dday = couponDetail?.earliestPickupDate ?? '';
    this.Ddeadline = couponDetail?.redeemLimit ?? 0;
    this.isGive = couponDetail?.isTransferable ? '1' : '2'; //1: true, 2: false
    this.level = memberShips ?? [];
    this.limits = couponDetail?.redeemLimit ?? '';
    this.mainImageUrl = couponDetail?.mainImageUrl
      ? [couponDetail?.mainImageUrl]
      : [];
    this.thumbnailImageUrl = couponDetail?.thumbnailImageUrl
      ? [couponDetail?.thumbnailImageUrl]
      : [];
    this.points = couponDetail?.point ?? 0;
    this.releaseNum = couponDetail?.quantity ?? 0;
    this.releaseState = couponDetail?.releaseStatus ? '1' : '0';
    this.writeOff = couponDetail?.writeoffChannelId ?? '';
    this.lastCount = couponDetail?.lastCount ?? 0;
    this.memberReceiveCount = couponDetail?.memberReceiveCount ?? 0;
  }
}

export default CouponInfoClass;
