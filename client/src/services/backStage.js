import { post } from './sub_services/base';
import apiPath from './api.path';
import config from 'config/config';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'services/backStage.js',
  _NOTICE: 'backStage api'
});

/** [POST]取得後台文章列表 */
const getBackStagePostList = async (req) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.backStage.getBackStagePostList}`;
    const result = await post(url, req);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBackStagePostList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getBackStagePostList
};
