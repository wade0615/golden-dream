import { get, post, postFormData } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/common.js',
  _NOTICE: 'common api'
});

/* [GET]取得資料中心選單 */
const getTownshipCityData = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.common.getTownshipCityData}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getTownshipCityData', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* 上傳圖片 */
const uploadImage = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.common.uploadImage}`;
    const result = await postFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'uploadImage', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** 取得 redis keys */
const getRedisKeys = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.common.getRedisKeys}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getRedisKeys', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** 刪除 redis key */
const delRedisKey = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.common.delRedisKey}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delRedisKey', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** 匯出 Csv 資料 */
const exportCsvData = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.common.exportCsvData}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'exportCsvData', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getTownshipCityData,
  uploadImage,
  getRedisKeys,
  delRedisKey,
  exportCsvData
};
