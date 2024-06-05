class CouponSendInfoClass {
  constructor(data) {
    this.name = data?.name ?? '';
    this.executeTime = '2'; //指定發放日
    this.specificTime = new Date(data?.cisDate);
    this.coupon =
      data?.couponSendDetail?.map((c) => ({
        id: c.couponId,
        label: c.couponName
      })) ?? [];
    this.member = !!data?.memberExcelUrl ? '1' : '2';
    this.remark = data?.remark ?? '';
    this.icp = [data?.mobileCountryCode ?? '+886'];
    this.mobile = data?.mobile ?? '';
  }
}

export default CouponSendInfoClass;
