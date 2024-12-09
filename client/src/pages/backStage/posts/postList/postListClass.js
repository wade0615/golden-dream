import { formatDefTimeNew } from 'utils/timeUtils';
const GetPostsClass = class {
  constructor(data) {
    this.metaData = {
      page: data?.metaData?.page ?? 1,
      perPage: data?.metaData?.perPage ?? 10,
      totalCount: data?.metaData?.totalCount ?? 66,
      totalPages: data?.metaData?.totalPages ?? 7
    };
    this.postList = data?.postList?.map((_post) => new Post(_post)) ?? [];
  }
};

const Post = class {
  constructor(data) {
    this.postId = data?.id ?? crypto.randomUUID();
    this.title = data?.title ?? '未知的標題';
    this.createDate =
      formatDefTimeNew(data?.createDate, {
        formatString: 'yyyy/MM/dd'
      }) ?? '';
    this.updateDate =
      formatDefTimeNew(data?.alterDate, {
        formatString: 'yyyy/MM/dd'
      }) ?? '';
    this.category = data?.category ?? '';
    this.tag = data?.tag ?? '';
    this.content = data?.content ?? '';
    this.updatePerson = data?.alterPerson ?? 'Owner';
  }
};

export { GetPostsClass };
