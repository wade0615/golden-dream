import { post, get } from './sub_services/base';
import apiPath from './api.path';
import config from 'config/config';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'services/test.js',
  _NOTICE: 'test api'
});

/* [GET]punchme */
const punchme = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.test.punchme}`;
    const result = await get(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'punchme', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  punchme
};
