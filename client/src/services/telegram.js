import { post } from './sub_services/base';
import apiPath from './api.path';
import config from 'config/config';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'services/telegram.js',
  _NOTICE: 'telegram api'
});

/* [POST]發送 Telegram 訊息 */
const postTelegramMsg = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tg.postTelegramMsg}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'postTelegramMsg', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  postTelegramMsg
};
