export enum ENUM_CONFIG {
  /** 伺服器正名 */
  SERVER_NAME = 'SERVER',
  /** 伺服器對外 */
  SERVER_TO_OTHER = `SERVER_TO_OTHER`,
  /** 服務鎖前墜 */
  PROCESS_LOCK = 'PROCESS_LOCK'
}

// 雲端上設定為 UTC＋0
// etg. config > 16-21 = 00:00~05:59 (台灣時間)
export enum ENUM_FREQUENCY {
  ONE_SECOND = '*/1 * * * * *',
  THREE_SECOND = '*/3 * * * * *',
  FIVE_SECOND = '*/5 * * * * *',
  TEN_SECOND = '*/10 * * * * *',
  TEN_SECOND_22_23 = '*/10 * 22-23 * * *',
  TEN_SECOND_0_15 = '*/10 * 0-15 * * *',
  TWENTY_SECOND = '*/20 * * * * *',
  ONE_MINUTE = '*/1 * * * *',
  FIVE_MINUTE = '*/5 * * * *',
  FIVE_MINUTE_22_23 = '*/5 22-23 * * *',
  FIVE_MINUTE_0_15 = '*/5 0-15 * * *',
  FIVE_MINUTE_0_1 = '*/5 16-17 * * *', // 00:00~01:59
  TEN_MINUTE = '*/10 * * * *',
  TWENTY_MINUTE = '*/20 * * * *',
  THIRTY_MINUTE = '*/30 * * * *',
  ONE_HOUR = '*/1 * * *',
  ONE_HOUR_6_8 = '0 22-23 * * *',
  ONE_HOUR_8_23 = '0 0-15 * * *',
  EVERY_SIX_HOUR = '0 */6 * * *', // 每6小時, 00:00, 06:00, 12:00, 18:00
  /** 每月 */
  EVERY_MONTH = '0 0 0 1 * *',
  /** 每季 */
  EVERY_QUARTERLY = '0 0 0 1 */3 *',
  /** 每年指定時間 */
  EVERY_YEAR = '0 0 0 1 1 *',
  /** 每日指定時間 UTC+0，台灣時間為00:00:00 */
  EVERY_DAY_0_1 = '0 */10 16 * * *',
  /** 每日4-5時，每5分執行一次 */
  EVERY_DAY_4_5_10S = '*/10 * 20 * * *',
  /** 每日4-5時，每5分執行一次 */
  EVERY_DAY_4_5_5M = '0 */5 20 * * *',
  /** 每日5-9時，每10秒執行一次 */
  EVERY_DAY_5_9 = '*/10 * 21,22,23,0 * * *',
  /** 每日 3:31-3:58時，每10秒執行一次 */
  EVERY_DAY_331_359 = '*/10 31-58 19 * * *',
  /** 每日 4:00-430 時，每10秒執行一次 */
  EVERY_DAY_400_430 = '*/10 0-29 20 * * *',
  /** 每日 4:31-4:59 時，每10秒執行一次 */
  EVERY_DAY_431_459 = '*/10 31-59 20 * * *'
}
