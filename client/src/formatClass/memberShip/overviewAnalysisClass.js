import { insertComma } from 'utils/commonUtil';
import { formatDefTimeNew } from 'utils/timeUtils';

/* 會員總覽分析 */
class OverviewAnalysisClass {
  constructor(data, genderOptions, cityCodeOptions, zipCodeOptions) {
    this.memberCardId = data?.memberCardId ?? '';
    this.birthday = data?.birthday
      ? formatDefTimeNew(new Date(data.birthday))
      : '';
    this.gender =
      data?.gender && genderOptions
        ? genderOptions.find((option) => option.value === data.gender)?.label ||
          ''
        : '';
    this.referralCode = data?.referralCode ?? '';
    this.memberShipDate =
      data?.memberShipStartDate && data?.memberShipEndDate
        ? formatDefTimeNew(new Date(data.memberShipStartDate)) +
          ' ~ ' +
          formatDefTimeNew(new Date(data.memberShipEndDate))
        : '';
    this.registerDate = data?.registerDate
      ? formatDefTimeNew(new Date(data.registerDate))
      : '';
    this.registerChannel = data?.registerChannel ?? '';
    this.openChannel = data?.openChannel ?? '';
    this.completeAddress =
      cityCodeOptions && zipCodeOptions
        ? (data.zipCode ?? '') +
          (cityCodeOptions.find((option) => option.value === data.cityCode)
            ?.label || '') +
          (zipCodeOptions[data.cityCode]
            ? zipCodeOptions[data.cityCode].find(
                (option) => option.value === data.zipCode
              )?.label || ''
            : '') +
          (data.address ?? '')
        : '';
    this.email = data?.email ?? '';
    this.tagNames = data?.tagNames ?? [];
    this.memberShipDetail = data?.analysis.memberShipDetail
      ? [
          {
            text:
              (data?.analysis.memberShipDetail.memberShipMethodsName ?? '') +
              (data?.analysis.memberShipDetail.memberShipName ?? '') +
              '差異消費次數',
            number: data?.analysis.memberShipDetail.consumptionCount
              ? insertComma(
                  Number(data?.analysis.memberShipDetail.consumptionCount)
                )
              : 0
          },
          {
            text:
              (data?.analysis.memberShipDetail.memberShipMethodsName ?? '') +
              (data?.analysis.memberShipDetail.memberShipName ?? '') +
              '差額',
            number: data?.analysis.memberShipDetail.consumptionAmount
              ? `$${insertComma(
                  Number(data?.analysis.memberShipDetail.consumptionAmount)
                )}`
              : '$0'
          }
        ]
      : [];
    this.pointDetail = data?.analysis.pointDetail
      ? [
          {
            text: '剩餘可使用積點',
            number: data?.analysis.pointDetail.lastPoint
              ? insertComma(Number(data?.analysis.pointDetail.lastPoint))
              : 0
          },
          {
            text: '即將到期積點',
            number: data?.analysis.pointDetail.expiringPoint
              ? insertComma(Number(data?.analysis.pointDetail.expiringPoint))
              : 0
          }
        ]
      : [];
    this.consumptionDetail = data?.analysis.consumptionDetail
      ? [
          {
            text: '年度消費次數',
            number: data?.analysis.consumptionDetail.consumptionCount
              ? insertComma(
                  Number(data?.analysis.consumptionDetail.consumptionCount)
                )
              : 0
          },
          {
            text: '年度消費金額',
            number: data?.analysis.consumptionDetail.consumptionAmount
              ? `$${insertComma(
                  Number(data?.analysis.consumptionDetail.consumptionAmount)
                )}`
              : '$0'
          }
        ]
      : [];
    this.consumptionBrand =
      data?.analysis.consumptionBrand?.map((brand) => ({
        brandName: brand.brandName ?? '',
        brandCount: insertComma(Number(brand.brandCount)) || '',
        consumptionDate: brand.consumptionDate
          ? formatDefTimeNew(new Date(brand.consumptionDate))
          : ''
      })) ?? [];
    this.consumptionCommodity =
      data?.analysis.consumptionCommodity?.map((commodity) => ({
        commodityName: commodity.commodityName ?? '',
        commodityCount: insertComma(Number(commodity.commodityCount)) || '',
        consumptionDate: commodity.consumptionDate
          ? formatDefTimeNew(new Date(commodity.consumptionDate))
          : ''
      })) ?? [];
    this.consumptionElectronicCoupon =
      data?.analysis.consumptionElectronicCoupon?.map((coupon) => ({
        electronicCouponName: coupon.electronicCouponName ?? '',
        electronicCouponCount:
          insertComma(Number(coupon.electronicCouponCount)) || '',
        consumptionDate: coupon.consumptionDate
          ? formatDefTimeNew(new Date(coupon.consumptionDate))
          : ''
      })) ?? [];
  }
}

export default OverviewAnalysisClass;
