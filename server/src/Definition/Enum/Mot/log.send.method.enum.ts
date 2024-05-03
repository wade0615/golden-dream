export enum ENUM_LOG_SEND_METHOD {
  /** APP推播 */
  APP = 'app',
  /** 簡訊 */
  SMS = 'sms',
  /** Email */
  EMAIL = 'email'
}

export const ENUM_LOG_SEND_METHOD_STR = {
  [ENUM_LOG_SEND_METHOD.APP]: 'APP推播',
  [ENUM_LOG_SEND_METHOD.SMS]: '簡訊',
  [ENUM_LOG_SEND_METHOD.EMAIL]: 'Email'
};
