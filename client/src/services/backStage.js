import { get, post, patch } from './sub_services/base';
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

/** [POST]取得後台指定文章 */
const getBackStagePostById = async (req) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.backStage.getBackStagePostById}`;
    const result = await post(url, req);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBackStagePostById', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [GET]取得後台分類下拉選單 */
const getBackStageCategoryOptions = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.backStage.getBackStageCategoryOptions}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBackStageCategoryOptions', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]後台新增文章 */
const postBackStageAddPost = async (req) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.backStage.postBackStageAddPost}`;
    const result = await post(url, req);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'postBackStageAddPost', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [PATCH]後台編輯文章 */
const patchBackStageEditPost = async (req) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.backStage.patchBackStageEditPost}`;
    const result = await patch(url, req);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'patchBackStageEditPost', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getBackStagePostList,
  getBackStagePostById,
  postBackStageAddPost,
  patchBackStageEditPost,
  getBackStageCategoryOptions
};
