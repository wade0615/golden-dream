import { insertComma } from 'utils/commonUtil';
import { formatDefTimeNew } from 'utils/timeUtils';

class GroupDownloadListClass {
  constructor(data) {
    this.exportId = data?.exportId ?? '';
    this.clusterId = data?.clusterId ?? '';
    this.clusterName = data?.clusterName ?? '';
    this.peopleCount = insertComma(data?.peopleCount) ?? '';
    this.csvUrl = data?.csvUrl ?? '';
    this.exportTime = data?.exportDate
      ? formatDefTimeNew(new Date(data?.exportDate), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.exportPerson = data?.exportName ?? '';
    this.createTime = data?.createDate
      ? formatDefTimeNew(new Date(data?.createDate), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.createPerson = data?.createName ?? '';
    this.updateTime = data?.alterDate
      ? formatDefTimeNew(new Date(data?.alterDate), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.updatePerson = data?.alterName ?? '';
  }
}

export default GroupDownloadListClass;
