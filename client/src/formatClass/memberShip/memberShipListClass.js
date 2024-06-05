import { formatDefTimeNew } from 'utils/timeUtils';

class MemberShipListClass {
  constructor(data) {
    this.settingId = data?.settingId ?? '';
    this.version = data?.settingName ?? '';
    this.stateStr = data?.settingStatusStr ?? '';
    this.state = data?.settingStatus;
    this.scheduledDate = data?.effectiveStarDate
      ? formatDefTimeNew(new Date(data?.effectiveStarDate))
      : '';
    this.effectiveDate = data?.realStartDate ?? '';
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

export default MemberShipListClass;
