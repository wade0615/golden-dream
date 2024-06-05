import couponType from 'constants/couponType';
import { formatDefTimeNew } from 'utils/timeUtils';

class CouponSendItemClass {
  constructor(data) {
    this.id = data?.id ?? '';
    this.name = data?.name ?? '';
    this.couponType = Object.values(couponType)[data?.couponType - 1];
    this.cisDate = data?.cisDate
      ? formatDefTimeNew(new Date(data?.cisDate))
      : '';
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

export default CouponSendItemClass;
