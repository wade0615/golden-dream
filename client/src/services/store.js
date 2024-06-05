import { post, get } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/brand.js',
  _NOTICE: 'brand api'
});

/* [POST]取得門市列表 */
const getStoreList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.stroe.getStoreList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBrandList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]編輯門市 */
const updStoreDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.stroe.updStoreDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updStoreDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]取得門市下拉選單 */
const getStoreMallMenu = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.stroe.getStoreMallMenu}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getStoreMallMenu', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getStoreList,
  updStoreDetail,
  getStoreMallMenu
};
