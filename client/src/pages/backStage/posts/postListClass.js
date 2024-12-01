import { formatDefTimeNew } from 'utils/timeUtils';

const MemberListDataClass = class {
  constructor(data) {
    this.memberId = data?.memberId ?? crypto.randomUUID();
    this.name = data?.memberName ?? '';
    this.isDelete = data?.isDelete ?? 0;
    this.cardNO = data?.memberCardId ?? '';
    this.mobile =
      data?.mobileCountryCode && data?.phone
        ? `${data?.mobileCountryCode}-${data?.phone}`
        : '';
    this.level = data?.membershipStatus ?? '';
    this.birthday = data?.birthday
      ? formatDefTimeNew(new Date(data?.birthday))
      : '';
    this.registerDate = data?.registerTime
      ? formatDefTimeNew(new Date(data?.registerTime), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.updateDate = data?.alterTime
      ? formatDefTimeNew(new Date(data?.alterTime), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.updatePerson = data?.alterName ?? '';
  }
};

export { MemberListDataClass };
