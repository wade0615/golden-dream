const GetPostByIdClass = class {
  constructor(data) {
    this.id = data.id ?? null;
    this.title = data.title ?? '未知的標題';
    this.createdDate = data.createdDate ?? '未知的日期';
    this.tag = data.tag ?? '未知的標籤';
    this.content = data.content ?? '未知的內容';
  }
};

export { GetPostByIdClass };
