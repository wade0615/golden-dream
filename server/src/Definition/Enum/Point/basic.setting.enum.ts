/** 積點基本設定欄位名稱  */
export enum ENUM_BASIC_SETTING {
  POINT_ID = 'pointId',
  PPINT_NAME = 'pointName',
  EXPIRY_DATE = 'expiryDate',
  EXPIRY_MONTH = 'expiryMonth',
  EXPIRY_YEAR = 'expiryYear',
  PPINT_RATIO = 'pointRatio',
  CHANNEL = 'channel'
}

export const ENUM_BASIC_SETTING_STR = {
  [ENUM_BASIC_SETTING.POINT_ID]: '積點編號',
  [ENUM_BASIC_SETTING.PPINT_NAME]: '積點名稱',
  [ENUM_BASIC_SETTING.EXPIRY_DATE]: '積點預設效期-日',
  [ENUM_BASIC_SETTING.EXPIRY_MONTH]: '積點預設效期-月',
  [ENUM_BASIC_SETTING.EXPIRY_YEAR]: '積點預設效期-年',
  [ENUM_BASIC_SETTING.PPINT_RATIO]: '積點與金額比例',
  [ENUM_BASIC_SETTING.CHANNEL]: '會員消費-納入積點計算時間'
};
