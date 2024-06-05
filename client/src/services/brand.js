import { post, get } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/brand.js',
  _NOTICE: 'brand api'
});

/* [POST]取得品牌列表 */
const getBrandList = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.brand.getBrandList}`;
    const result = await post(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBrandList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]編輯品牌 */
const updBrandDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.brand.updBrandDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updBrandDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]刪除品牌 */
const delBrandDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.brand.delBrandDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delBrandDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]修改品牌排序 */
const updBrandSort = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.brand.updBrandSort}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updBrandSort', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]取得品牌下拉選項 */
const getBrandMenu = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.brand.getBrandMenu}`;
    const result = await get(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBrandMenu', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]取得品牌與門市下拉選項 */
const getBrandMapStoreMenu = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.brand.getBrandMapStoreMenu}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBrandMapStoreMenu', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得品牌與門市列表 */
const getBrandAndStoreList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.brand.getBrandAndStoreList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBrandAndStoreList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getBrandList,
  updBrandDetail,
  delBrandDetail,
  updBrandSort,
  getBrandMenu,
  getBrandAndStoreList,
  getBrandMapStoreMenu
};
