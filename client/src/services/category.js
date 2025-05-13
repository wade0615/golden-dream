import { get, post } from './sub_services/base';
import apiPath from './api.path';
import config from 'config/config';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'services/category.js',
  _NOTICE: 'category api'
});

/* [GET]取得文章分類列表 */
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

/* [POST]取得分類文章列表 */
const getCategoryPostList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.category.getCategoryPostList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getCategoryPostList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getCategoryList,
  getCategoryPostList
};
