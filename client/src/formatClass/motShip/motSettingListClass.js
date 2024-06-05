import { formatDefTimeNew } from 'utils/timeUtils';

class MotSettingListClass {
  constructor(data) {
    this.event = data?.event ?? '';
    this.eventName = data?.eventName ?? '';
    this.state = data?.state ?? false;
    this.appPush = data?.appPush ?? false;
    this.sms = data?.sms ?? false;
    this.email = data?.email ?? false;
    this.mainIsSave = data?.mainIsSave ?? false;
    this.canUpdateApp = data?.canUpdateApp ?? false;
    this.canUpdateSms = data?.canUpdateSms ?? false;
    this.canUpdateEmail = data?.canUpdateEmail ?? false;
    this.updateTime = data?.alterDate
      ? formatDefTimeNew(new Date(data?.alterDate), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.updatePerson = data?.alterId ?? '';
  }
}

export default MotSettingListClass;
