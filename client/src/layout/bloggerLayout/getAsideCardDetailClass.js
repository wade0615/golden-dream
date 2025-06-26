const GetAsideCardDetailClass = class {
  constructor(data) {
    this.postCount = data.postCount ?? 0;
    this.categoriesCount = data.categoriesCount ?? 0;
  }
};

export { GetAsideCardDetailClass };
