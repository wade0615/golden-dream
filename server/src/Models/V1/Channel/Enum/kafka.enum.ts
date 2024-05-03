export enum KAFKA_SYNC_TYPE {
  /** 註冊同步 */
  REGISTER = 'Register',
  /** 驗證狀態同步 */
  PHONE_VERIFY = 'PhoneVerify',
  /** 更新會員資料 */
  UPDATE_MEMBER = 'UpdateMember',
  /** 註銷會員 */
  DELETE_MEMBER = 'DeleteMember',
  /** 渠道互通紀錄 */
  CHANNEL_ACTION_LOG = 'ChannelActionLog'
}
