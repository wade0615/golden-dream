import { post, get } from './sub_services/base';
import apiPath from './api.path';
import config from 'config/config';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'services/posts.js',
  _NOTICE: 'posts api'
});

/* [POST]取得文章列表 */
const getPostList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.posts.getPostList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getPostList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getPostList
};
