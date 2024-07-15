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
    this.id = data?.id ?? crypto.randomUUID();
    this.title = data?.title ?? '未知的標題';
    this.date = data?.date ?? '';
    this.tag = data?.tag ?? '';
    this.content = data?.content ?? '';
  }
};

export { GetPostsClass };
