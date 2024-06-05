import { get, post } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/template.js',
  _NOTICE: 'template api'
});

/* [GET]範例 */
const getTemplate = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.template.getTemplate}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'template', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]範例 */
const postTemplate = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.template.postTemplate}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBlockInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getTemplate,
  postTemplate
};
