import { post, get, del } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/brand.js',
  _NOTICE: 'brand api'
});

/* [POST]取得餐期列表 */
const getMealPeriodList = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mealPeriod.getMealPeriodList}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMealPeriodList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]編輯品牌 */
const addMealPeriod = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mealPeriod.addMealPeriod}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateMealPeriodSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]編輯品牌 */
const updMealPeriodDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mealPeriod.updMealPeriodDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateMealPeriodSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]刪除品牌 */
const delMealPeriodDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mealPeriod.delMealPeriodDetail}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delMealPeriodSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]修改品牌排序 */
const updMealPeriodSort = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mealPeriod.updMealPeriodSort}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updMealPeriodSort', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getMealPeriodList,
  updMealPeriodDetail,
  delMealPeriodDetail,
  updMealPeriodSort,
  addMealPeriod
};
