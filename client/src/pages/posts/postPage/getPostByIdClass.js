import { formatDefTimeNew } from 'utils/timeUtils';
const GetPostByIdClass = class {
  constructor(data) {
    this.id = data.id ?? null;
    this.title = data.title ?? '未知的標題';
    this.createdDate =
      formatDefTimeNew(data?.createdDate, {
        formatString: 'yyyy/MM/dd'
      }) ?? '未知的日期';
    this.category = data.category ?? '未知的分類';
    this.tag = data.tag ?? '未知的標籤';
    this.content = data.content ?? '未知的內容';
    this.prevPostId = data.prevPostId ?? null;
    this.nextPostId = data.nextPostId ?? null;
  }
};

export { GetPostByIdClass };
