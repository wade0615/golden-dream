import { get } from './sub_services/base';
import apiPath from './api.path';
import config from 'config/config';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'services/category.js',
  _NOTICE: 'category api'
});

/* [POST]取得文章分類列表 */
const getCategoryList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.category.getCategoryList}`;
    const result = await get(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getCategoryList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getCategoryList
};
