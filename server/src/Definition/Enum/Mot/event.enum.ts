export enum ENUM_EVENT {
  /** 註冊通知 */
  REGISTER = 'register',
  /** 註冊禮到期提醒 */
  REGISTER_GIFT_END = `registerGiftEnd`,
  /** 會籍到期提醒 */
  MEMBER_SHIP_END = `memberShipEnd`,
  /** 即將升等/續等提醒 */
  UPGRADE_RENEWAL = `upgradeRenewal`,
  /** 升等禮發送 */
  UPGRADE_GIFT_SEND = `upgradeGiftSend`,
  /** 升等禮到期提醒 */
  UPGRADE_GIFT_END = `upgradeGiftEnd`,
  /** 續會禮發送 */
  RENEWAL_GIFT_SEND = `renewalGiftSend`,
  /** 續會禮到期提醒*/
  RENEWAL_GIFT_END = `renewalGiftEnd`,
  /** 生日禮領取提醒 */
  BIRTHDAY_GIFT_RECEIVE = `birthdayGiftReceive`,
  /** 生日禮到期提醒 */
  BIRTHDAY_GIFT_END = `birthdayGiftEnd`,
  /** 集點卡-開始集點  */
  REWARD_START = `rewardStart`,
  /** 集點卡-即將集滿提醒 */
  REWARD_NEARLY_FINISHED = `rewardNearlyFinished`,
  /** 集點卡-已集滿*/
  REWARD_FINISHED = `rewardFinished`,
  /** 優惠券到期提醒 */
  COUPON_END = `couponEnd`,
  /** 商品券待核銷提醒 */
  WRITE_ORR_COUPON = `writeOffCoupon`,
  /** 積點到期提醒 */
  POINT_END = `pointEnd`
}
