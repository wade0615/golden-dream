// radio 的 option value type 為 string , 須把 number 改為 string 1 => '1'

/* 整理會籍資料 */
class MemberShipInfoClass {
  constructor(data) {
    this.memberShipId = data?.memberShipId ?? '';
    this.memberShipName = data?.memberShipName ?? '';
    this.nextMemberShip = data?.nextMemberShip ?? '';
    this.purchasedCount = data?.purchasedCount ?? '';
    this.purchasedTimes = data?.purchasedTimes ?? '';
    this.expiresChange = data?.expiresChange ? `${data?.expiresChange}` : '0';
    this.basicSetting = {
      activeStatus: data?.basicSetting?.activeStatus ?? '',
      activeDay: data?.basicSetting?.activeDay ?? '',
      setting: data?.basicSetting?.setting?.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.pointRatioType]: {
            pointType: cur?.pointRatioType ?? '',
            status: cur?.status ?? false,
            purchasedSum: cur?.purchasedSum ?? '',
            purchasedEvery: cur?.purchasedEvery ?? '',
            purchasedPoint: cur?.purchasedPoint ?? ''
          }
        }),
        {}
      )
    };
    this.birthdaySetting = {
      activeStatus: data?.birthdaySetting?.activeStatus ?? '',
      activeDay: data?.birthdaySetting?.activeDay ?? '',
      setting: data?.birthdaySetting?.setting?.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.pointRatioType]: {
            pointType: cur?.pointRatioType ?? '',
            status: cur?.status ?? false,
            purchasedSum: cur?.purchasedSum ?? '',
            purchasedEvery: cur?.purchasedEvery ?? '',
            purchasedPoint: cur?.purchasedPoint ?? ''
          }
        }),
        {}
      )
    };
    this.renewalGift = !!data?.renewalGift?.length
      ? data?.renewalGift.map((ele) => ({
          id: ele.couponId,
          label: ele.couponName
        }))
      : [];
    this.upgradeGift = !!data?.upgradeGift?.length
      ? data?.upgradeGift.map((ele) => ({
          id: ele.couponId,
          label: ele.couponName
        }))
      : [];
  }
}

/* 新增會籍初始資料 */
class CreateEmptyInfo {
  constructor(name = '') {
    this.memberShipId = '';
    this.memberShipName = name;
    this.nextMemberShip = '';
    this.purchasedCount = '';
    this.purchasedTimes = '';
    this.expiresChange = '0';
    this.basicSetting = {
      activeStatus: '',
      activeDay: '',
      setting: ['Fix', 'Ratio'].reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: {
            pointType: cur,
            status: false,
            purchasedSum: '',
            purchasedEvery: '',
            purchasedPoint: ''
          }
        }),
        {}
      )
    };
    this.birthdaySetting = {
      activeStatus: '',
      activeDay: '',
      setting: ['Fix', 'Ratio'].reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: {
            pointType: cur,
            status: false,
            purchasedSum: '',
            purchasedEvery: '',
            purchasedPoint: ''
          }
        }),
        {}
      )
    };
  }
}

export { CreateEmptyInfo };
export default MemberShipInfoClass;
