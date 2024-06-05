import { formatDefTimeNew } from 'utils/timeUtils';

class TagListClass {
  constructor(data) {
    this.tagId = data?.tagId ?? '';
    this.tagName = data?.tagName ?? '';
    this.groupName = data?.tagGroupName ?? '';
    this.state = data?.state ?? '';
    this.activeType = data?.dateState ?? '';
    this.totalMemberCount = data?.tagMemberCount ?? '';
    this.activeTime =
      data?.startDate && data?.endDate
        ? `${formatDefTimeNew(new Date(data?.startDate))} ~${formatDefTimeNew(
            new Date(data?.endDate)
          )}`
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

export default TagListClass;
