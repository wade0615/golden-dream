/* 整理 api 資料的 class function */

/* 
- 用 ?. 串 某個物件底下的 key 值，以防 can't read undefined 畫面炸裂
-
-  A ?? B 
(nullish operator): 若 A 是 null 或 undefined 就會返回 B
*/

const TemplateDataClass = class {
  constructor(data) {
    this.name = data?.name ?? 'template';
  }
};

export { TemplateDataClass };
