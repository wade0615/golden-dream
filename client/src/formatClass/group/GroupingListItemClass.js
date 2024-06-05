import { formatDefTimeNew } from 'utils/timeUtils';
import { insertComma } from 'utils/commonUtil';
import groupingRegularExportStatus from 'constants/groupingRegularExportStatus';

class GroupingListItemClass {
  constructor(data) {
    this.clusterId = data?.clusterId ?? '';
    this.clusterName = data?.clusterName ?? '';
    this.peopleCount = insertComma(data?.peopleCount) ?? 0;
    this.monthEvery = data?.monthEvery ?? 0;
    this.exportStatus = data?.exportStatus ?? '';
    this.dataType = data?.dataType ?? '';
    this.exportStartDate = data?.exportStartDate
      ? formatDefTimeNew(data?.exportStartDate)
      : '';
    this.exportEndDate = data?.exportEndDate
      ? formatDefTimeNew(data?.exportEndDate)
      : '';
    this.exportName = data?.exportName ?? '';
    this.createTime = data?.createTime
      ? formatDefTimeNew(data?.createTime, { formatString: 'yyyy/MM/dd HH:mm' })
      : '';
    this.createName = data?.createName ?? '';
    this.alterTime = data?.alterTime
      ? formatDefTimeNew(data?.alterTime, { formatString: 'yyyy/MM/dd HH:mm' })
      : '';
    this.alterName = data?.alterName ?? '';

    this.exportTime =
      data?.exportStatus === groupingRegularExportStatus.immediate
        ? formatDefTimeNew(data?.createTime)
        : data?.exportStatus === groupingRegularExportStatus.specifiedDate
        ? `${this.exportStartDate}`
        : `${this.exportStartDate} ~ ${this.exportEndDate}`;

    this.exportPeriod = this.mappingSwitch(data?.exportStatus);
  }
  mappingSwitch(val) {
    switch (val) {
      case groupingRegularExportStatus.everyHalfMonth:
        return '每半月';
      case groupingRegularExportStatus.everyMonth:
        return '每月';
      case groupingRegularExportStatus.everyQuarter:
        return '每季';
      case groupingRegularExportStatus.specifiedRangeDate:
        return `指定日期 - 每滿 ${this?.monthEvery} 個月`;
      case groupingRegularExportStatus.specifiedDate:
      case groupingRegularExportStatus.immediate:
        return '';
      default:
        return '--';
    }
  }
}

export default GroupingListItemClass;
