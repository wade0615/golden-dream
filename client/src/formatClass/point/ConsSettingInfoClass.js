class ConsSettingInfoClass {
  constructor(data) {
    this.rewardId = data.rewardId || '';
    this.rewardName = data.rewardName || '';
    this.startDate = data.startDate || '';
    this.endDate = data.endDate || '';
    this.excludeDate = data.exceptionDate || [];
    this.channelId = data.channelId || [];
    this.memberShip = data.memberShip || [];
    this.mealPeriod = data.mealPriodId || [];
    this.pointSetting = Array.isArray(data.rewardPoints)
      ? this.transformRewardPoints(data.rewardPoints)
      : [];
    this.activeStatus = parseInt(data.activeStatus, 10) || 0;
    this.activeDay = data.activeDay || 1;
    this.selectStore = String(data.selectStore) || '0';
    this.brand = Array.isArray(data.brands)
      ? this.transformBrandList(data.brands)
      : [];
  }
  transformRewardPoints(rewardPoints) {
    // 重新排序，確保 Type:"Ratio" 是第一個
    const sortedPoints = rewardPoints.sort((a, b) =>
      a.ratioType === 'Ratio' ? -1 : 1
    );
    // 修改物件結構
    return sortedPoints.map((point) => {
      return {
        pointType: point.ratioType,
        status: point.ratioStatus || false,
        purchasedSum: point.purchasedSum || '',
        purchasedEvery: point.purchasedEvery || '',
        handselPoint: point.handselPoint || ''
      };
    });
  }
  transformBrandList(brands) {
    const uniqueBrands = brands.map((brand) => {
      return {
        value: brand.brandId,
        label: brand.brandName,
        isOnly: brand.isCorporation
      };
    });
    return uniqueBrands;
  }
}

export default ConsSettingInfoClass;
