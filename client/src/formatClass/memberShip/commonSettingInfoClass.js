/* 通用設定info */
// radio 的 option value type 為 string , 須把 number 改為 string 1 => '1'
class CommonSettingInfoClass {
  constructor(data) {
    this.settingId = data?.settingId ?? '';
    this.settingName = data?.settingName ?? '';
    this.startDate = data?.startDate ? new Date(data?.startDate) : '';
    this.startDateCount = data?.startDateCount
      ? `${data?.startDateCount}`
      : '1';
    this.startDateYear = data?.startDateYear ?? '';
    this.endDate = data?.endDate ? `${data?.endDate}` : '1';
    this.consumptionUpgrade = data?.consumptionUpgrade
      ? `${data?.consumptionUpgrade}`
      : '1';
    this.consumptionDue = data?.consumptionDue
      ? `${data?.consumptionUpgrade}`
      : '1';
    this.isCopy = data?.isCopy ?? false;
    this.upgradeDay = data?.upgradeDay ? `${data?.upgradeDay}` : '';
    this.upgradeNum = data?.upgradeNum ? `${data?.upgradeNum}` : '1';
    this.registerGift = data?.registerGift
      ? data?.registerGift.map((item) => {
          return {
            ...item,
            status: !!item.couponDetail.length,
            couponDetail: !!item.couponDetail.length
              ? item.couponDetail.map((c) => ({
                  id: c.couponId,
                  label: c.couponName
                }))
              : []
          };
        })
      : [];
  }
}

/* 
    this.registerGiftConfig = data?.registerGift.reduce((acc, cur) => {
      return [
        ...acc,
        {
          checkbox: { value: cur.channelId, label: cur.channelName },
          couponDetail: cur?.couponDetail ?? []
        }
      ];
    }, []);
*/

export default CommonSettingInfoClass;
