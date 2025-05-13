export default class GetCategoryListClass {
  constructor(data) {
    this.id = data?.categoryId ?? crypto.randomUUID();
    this.name = data?.categoryName ?? '未知的分類';
  }
}

export { GetCategoryListClass };
