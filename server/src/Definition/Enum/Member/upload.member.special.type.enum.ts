export enum UPLOAD_TYPE_STR {
  /** 新增 */
  ADD = 1,
  /** 刪除 */
  DEL = 2
}

export const UPLOAD_TYPE = {
  [UPLOAD_TYPE_STR.ADD]: '1',
  [UPLOAD_TYPE_STR.DEL]: '2'
};

export enum UPLOAD_GPC_FILES_TYPE {
  /** Excel */
  EXCEL = 'excel',
  /** Csv */
  CSV = 'csv'
}
