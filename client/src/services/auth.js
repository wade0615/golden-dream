import { post, get } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/auth.js',
  _NOTICE: 'auth api'
});

/* [POST]後台會員登入 */
const login = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.auth.login}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'login', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]透過token取得用戶資訊 */
const getAuthInfo = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.auth.getAuthInfo}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getAuthInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]刷新會員token */
const refresh = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.auth.refresh}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'refresh', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]後台會員登出 */
const logout = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.auth.logout}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'logout', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]dashboard 首頁資訊 */
const getDashboard = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.auth.getDashboard}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getDashboard', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  login,
  getAuthInfo,
  refresh,
  logout,
  getDashboard
};
