import { formatDefTimeNew } from 'utils/timeUtils';

class RewardCardAdjustInfoClass {
  constructor(data, cardOptions, brandOptions) {
    const _selectedCard = cardOptions.find(
      (c) => c.value === data?.rewardCardId
    );
    const _isBrandCorporation = brandOptions.find(
      (b) => b.value === _selectedCard?.brandId
    )?.isCorporation;
    this.risType = data?.risType ? data?.risType.toString() : '';
    this.risItem = data?.risName ?? '';
    this.consumeDate = data?.consumeDate
      ? formatDefTimeNew(data?.consumeDate)
      : '';
    this.rewardCardId = data?.rewardCardId ?? '';
    this.brandId = _selectedCard?.brandId ?? '';
    this.storeId = data?.storeId ?? '';
    this.risStatus = data?.risStatus ? data?.risStatus?.toString() : ''; // 1:依系統排程 2: 指定發放日
    this.executeDate = data?.risDate ? formatDefTimeNew(data?.risDate) : ''; //指定發放日
    this.member = data?.excelUrl ? '1' : '2'; //1:批次匯入, 2: 指定會員
    this.file = '';
    this.excelUrl = data?.excelUrl ?? '';
    this.memberExcelCount = data?.memberExcelCount ?? 0;
    this.content = data?.remark ?? '';
    this.point = data?.rewardPoint ? data?.rewardPoint.toString() : '';
    this.icp = [data?.mobileCountryCode ?? '+886'];
    this.mobile = data?.mobile ?? '';
    this.endDate = _selectedCard?.endDate
      ? formatDefTimeNew(_selectedCard?.endDate, {
          isStart: false,
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : ''; // 集點卡過期日, for 卡控
    this.isCorporation = _isBrandCorporation ?? ''; // 品牌是否為集團, for 卡控
  }
}

export default RewardCardAdjustInfoClass;
