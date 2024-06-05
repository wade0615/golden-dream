import { formatDefTimeNew } from 'utils/timeUtils';
import { insertComma } from 'utils/commonUtil';

class MotTextItemClass {
  constructor(data) {
    this.clusterId = data?.clusterId ?? '';
    this.clusterName = data?.clusterName ?? '';
    this.createTime = data?.createTime
      ? formatDefTimeNew(data?.createTime, { formatString: 'yyyy/MM/dd HH:mm' })
      : '';
    this.createName = data?.createName ?? '';
    this.alterTime = data?.alterTime
      ? formatDefTimeNew(data?.alterTime, { formatString: 'yyyy/MM/dd HH:mm' })
      : '';
    this.alterName = data?.alterName ?? '';
    this.sendMethod = data?.sendMethod ?? [];
    this.peopleCount =
      data?.peopleCount?.map((ele) => (ele ? insertComma(ele) : '-')) ?? [];
    this.sendTime = data?.sendTime ?? [];
  }
}

export default MotTextItemClass;
