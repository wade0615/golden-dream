import { get } from './sub_services/base';
import apiPath from './api.path';
import config from 'config/config';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'services/common.js',
  _NOTICE: 'common api'
});

/** [GET]取得側邊欄小卡資訊 */
const getAsideCardDetail = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.common.getAsideCardDetail}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getAsideCardDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getAsideCardDetail
};
