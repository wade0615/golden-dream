import {
  post,
  get,
  getBlob,
  patchFormData,
  del,
  patch
} from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/point.js',
  _NOTICE: 'point api'
});

/* [GET] 積點發放規則篩選資料 */
const getPointSendingFilterOptions = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.getPointSendingFilterOptions}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getPointSendingFilterOptions', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 積點發放規則列表 */
const getPointSendingList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.getPointSendingList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getPointSendingList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 停用發放規則 */
const stopPointSending = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.stopPointSending}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'stopPointSending', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 複製發放規則 */
const copyPointSending = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.copyPointSending}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'copyPointSending', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [DELETE] 刪除消費型、活動型積點設定 */
const delPointSending = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.delPointSending}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delPointSending', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET] 積點調整列表 */
const getPointAdjustList = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.getPointAdjustList}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getPointAdjustList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 複製積點調整 */
const copyPointAdjust = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.copyPointAdjust}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'copyPointAdjust', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [DELETE] 刪除積點調整 */
const delPointAdjust = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.delPointAdjust}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delPointAdjust', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [GET] 下載上傳會員積點範本
 */
const downloadMemberPointExample = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.downloadMemberPointExample}`;
    const result = await getBlob(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'downloadMemberPointExample', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH]  匯入Excel 會員積點 */
const uploadMemberPoint = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.uploadMemberPoint}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'uploadMemberPoint', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET] 消費型積點設定所需參數 */
const getConsSettingParameter = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.getConsSettingParameter}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getConsSettingParameter', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 新增/編輯消費型積點設定 */
const consSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.consSetting}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'consSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 消費型積點設定詳細資料 */
const getConsSettingInfo = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.getConsSettingInfo}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getConsSettingInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 新增/編輯活動型積點設定 */
const rewardSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.rewardSetting}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'rewardSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 活動型積點設定詳細資料 */
const getRewardSettingInfo = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.getRewardSettingInfo}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getRewardSettingInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得商品門市列表 */
const getProductList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.getProductList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getProductList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET] 取得基本設定詳細資訊 */
const getBasicSettingInfo = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.getBasicSettingInfo}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getBasicSettingInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 編輯基本設定 */
const updateBasicSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.updateBasicSetting}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateBasicSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 積點調整詳細資訊 */
const getPointAdjustInfo = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.getPointAdjustInfo}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getPointAdjustInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 新增/編輯積點調整 */
const pointAdjust = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.point.pointAdjust}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'pointAdjust', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getPointSendingList,
  getPointSendingFilterOptions,
  copyPointSending,
  delPointSending,
  getPointAdjustList,
  stopPointSending,
  copyPointAdjust,
  delPointAdjust,
  downloadMemberPointExample,
  uploadMemberPoint,
  getConsSettingParameter,
  consSetting,
  getConsSettingInfo,
  rewardSetting,
  getRewardSettingInfo,
  getProductList,
  getBasicSettingInfo,
  updateBasicSetting,
  getPointAdjustInfo,
  pointAdjust
};
