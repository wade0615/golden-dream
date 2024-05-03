export enum ENUM_SETTING_SEND_METHOD {
  /** APP推播 */
  APP = 'app',
  /** 簡訊 */
  SMS = 'sms',
  /** Email */
  EMAIL = 'email',
  /** 會員可接收 APP 推播，即不發送簡訊 */
  NO_SMS = 'noSms',
  /** 忽略會員每月接收推播上限次數 */
  NEGLECT_MAX_COUNT = 'neglectCount'
}

export const ENUM_SETTING_SEND_METHOD_STR = {
  [ENUM_SETTING_SEND_METHOD.SMS]: '簡訊',
  [ENUM_SETTING_SEND_METHOD.APP]: 'APP 推播',
  [ENUM_SETTING_SEND_METHOD.EMAIL]: 'Email',
  [ENUM_SETTING_SEND_METHOD.NO_SMS]: '會員可接收 APP 推播，即不發送簡訊',
  [ENUM_SETTING_SEND_METHOD.NEGLECT_MAX_COUNT]: '忽略會員每月接收推播上限次數'
};
