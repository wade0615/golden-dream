export enum CSV_ACTION {
  /** 手機國碼&手機號碼 */
  MOBILE = 'mobile'
}

/**
 * CSV 暫存表通用欄位結構
 */
export enum CSV_TEMP_TABLE_COLUMN_SCHEMA {
  MOBILE_COUNTRY_CODE = 'Mobile_Country_Code varchar(6) NOT NULL',
  MOBILE = 'Mobile varchar(20) NOT NULL'
}

/**
 * CSV 暫存表通用欄位名稱
 */
export enum CSV_TEMP_TABLE_COLUMN_NAME {
  MOBILE_COUNTRY_CODE = 'Mobile_Country_Code',
  MOBILE = 'Mobile'
}
