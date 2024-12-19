// import { formatDefTimeNew } from 'utils/timeUtils';
const GetBackstageCategoryOptionsClass = class {
  constructor(data) {
    this.value = data.categoryId ?? '';
    this.label = data.categoryName ?? '未知的分類';
  }
};

export { GetBackstageCategoryOptionsClass };
