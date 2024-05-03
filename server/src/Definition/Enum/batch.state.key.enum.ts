export enum BATCH_STATE_KEY {
  /** 產生日銷售完成報表 */
  GEN_DAILY_FINISH_REPORT = 'generateDailyFinishReport',
  /** 會籍生效日檢查 */
  TAKE_EFFECT_MEMBER_SHIP = `takeEffectMemberShip`,
  /** 會籍升級 */
  UPGRADE_MEMBER_SHIP = `upgradeMemberShip`,
  /** 會籍降等 */
  DOWNGRADE_MEMBER_SHIP = `downgradeMemberShip`,
  /** 會籍續會 */
  RENEWAL_MEMBER_SHIP = `renewalMemberShip`,
  /** 會籍檢查 */
  CHECK_MEMBER_SHIP = `checkMemberShip`,
  /** 整理禮品發送資料 */
  COLLATING_GIFT = `collatingGift`,
  /** 發送入會禮/升等禮/續會禮 */
  SEND_GIFT = `sendGift`,
  /** 增點 */
  INC_POINT = `IncreasePoint`,
  /** 扣點 */
  DEC_POINT = `DecreasePoint`
}
export enum ENUM_BATCH_STATE_KEY {
  /** 積點調整 */
  ADJUST_POINT = `SCHEDULE_SWITCH:adjustPoint`
}

export enum ENUM_BATCH_TIME_KEY {
  /** 訂單資料收集 - 起始時間 */
  ODC_STARTMODIFYTIME = `TIME:orderDataCollection:startModifyTime`,
  /** 訂單資料收集 - 結束時間 */
  ODC_ENDMODIFYTIME = `TIME:orderDataCollection:endModifyTime`
}
