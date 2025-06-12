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
  _HASH_METHOD: {
    _SHA256: 'SHA256',
    _HEX: 'hex',
    _BASE64: 'base64',
    _KEY: 'neverDrinkIceLatte',
    _IV: '7371537416443538'
  },
  SWITCH_TTL: 1000 * 3,
  _ENCRYPT_CODE: {
    /** 私鑰 */
    PRIV_KEY: `-----BEGIN PRIVATE KEY-----\nMIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAL+XM5vEHDLhRxhz\nCVHqnc4l9vZC6kYnCvlvOHxnWcfo6RKmMlfP6O/akGHiYZ5aAx7PXC03tPfYKR9b\nnzx3oCUgJNhPA54z2HfRWGbzgVh2qeXABdqbSEfTLJCAUDdT+J1TZa8epVYejOpH\nx6f7HdeKOcGDc4mruoqA0qiVwb97AgMBAAECgYEAvhyEOnGb5aUDDjDAM8fSNQgZ\nCf4WR+xgCGkjrNZFEYh9FmNSGy6UnsTLdkXTxfTdmcn7VmcrrK+TBqm81ZyCi/uj\ndnh6vE3ohA0gq3iLzp/4eBBJXG8GNh3Hh4T44wcnjyLpmoDNO0SeH98pwu33PzbD\nb708qL9wA5PX1jSrX/kCQQDueVZ7KHfIsbGsRagdmUQfaZpp0YOfE3jVCnr44UYL\nF0pm5S774XxQve6PbFLcUkAVXHUFmNwchV9bPzdk07nnAkEAzavMSs6X3Uwf3Wqr\nrujfvLRVNOtBF6JEx36n146XuCg/iswFstVQLnpJJtCYWK6bGQmBMSPzHVG+gGYw\n4I3jTQJAIaMDy8NdgfVudjotCF/B+BxRJ3Ph+OIqPQKJbel4k7/pQrI4+lZHzqu7\npodE+MaxO1IbP3rcMTmuxZQZICOtKQJAExcGIE9qsyS0tHWJN/PviHFokz/ey9XI\n8odkBtL6bCJ4O2bShJXeGmJJVev4qAqU5M8ICcqfbzI+L2bM1Jr25QJBALbBJZKR\nKLCFB8tL4FjYAVKuImcLHSVmj0Ab6b2ZPMFGrQ3vv9Pv3kQxsKgthl0eettG7HJu\nUvFqVKkhH6hbzIY=\n-----END PRIVATE KEY-----`,
    /** 公鑰 */
    PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/lzObxBwy4UcYcwlR6p3OJfb2\nQupGJwr5bzh8Z1nH6OkSpjJXz+jv2pBh4mGeWgMez1wtN7T32CkfW588d6AlICTY\nTwOeM9h30Vhm84FYdqnlwAXam0hH0yyQgFA3U/idU2WvHqVWHozqR8en+x3XijnB\ng3OJq7qKgNKolcG/ewIDAQAB\n-----END PUBLIC KEY-----`
  }
};
