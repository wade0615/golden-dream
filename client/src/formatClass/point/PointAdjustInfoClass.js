import { formatDefTimeNew } from 'utils/timeUtils';

class PointAdjustInfoClass {
  constructor(data) {
    this.adjustId = data?.adjustId ?? '';
    this.adjustName = data?.adjustName ?? '';
    this.adjustType = data?.adjustType ? data?.adjustType.toString() : '';
    this.consumeDate = data?.consumeDate
      ? formatDefTimeNew(data?.consumeDate)
      : '';
    this.dataType = data?.dataType ? data?.dataType.toString() : '';
    this.adjustDate = data?.adjustDate
      ? formatDefTimeNew(data?.adjustDate)
      : '';
    this.memberType = data?.memberType ? data?.memberType.toString() : '';
    this.icp = data?.mobileContryCode ? [data?.mobileContryCode] : ['+886'];
    this.mobile = data?.mobile ?? '';
    this.brandId = data?.brandId ?? '';
    this.fileUrl = data?.fileUrl ?? '';
    this.fileName = data?.fileName ?? '';
    this.fileDataCount = data?.fileDataCount ?? 0;
    this.fileCount = data?.fileCount ?? 0;
    this.point = data?.point ? data?.point.toString() : '';
    this.activeStatus = data?.activeStatus ?? '';
    this.activeDay = data?.activeDay ? data?.activeDay.toString() : '';
    this.storeId = data?.storeId ?? '';
    this.remark = data?.remark ?? '';
  }
}

export default PointAdjustInfoClass;
