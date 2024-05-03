export default {
  REDIS_KEY: {
    CONFIG: 'config',
    TOKEN: 'accessToken',
    RFTOKEN: 'refreshToken',
    MAX_REDEEM_ID: 'max:redeem:id',
    MAX_COUPON_ID: 'max:coupon:id',
    MAX_COUPON_TRANSACTION_ID: 'max:coupon:transaction:id',
    MAX_REWARD_CARD_TRANSACTION_ID: 'max:reward:card:transaction:id',
    MAX_REWARD_CARD_ID: 'max:reward:card:id',
    MAX_CIS_ID: 'max:cis:id',
    MAX_RIS_ID: 'max:ris:id',
    MAX_ORDER_ID: 'max:order:id',
    MAX_EXPORT_ID: 'max:export:id',
    MAX_CLUSTER_ID: 'max:cluster:id',
    MEMBER_POINT_LOG: 'memberPointLog',
    DASHBOARD: 'dashboard'
  },
  TTL: {
    EVENT_ACTION: 5 * 60,
    JWT_TOKEN: 30 * 60,
    PRINT: 10,
    EXPORT: 10
  },
  SMS: {
    URL: 'https://biz3.e8d.tw/monthly/',
    USER_NAME: 'crm',
    PWD: 'o^D9lmN'
  },
  LOGGER_SWITCH: true, // TODO 要再移至.env
  LOGSWITCH: false, // TODO 要再移至.env
  _HASH_METHOD: {
    _SHA256: 'SHA256',
    _HEX: 'hex',
    _KEY: 'rstxprd7vhpa54ua',
    _IV: '7371537416443538'
  },
  SWITCH_TTL: 1000 * 3
};
