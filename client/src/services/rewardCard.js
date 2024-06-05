import {
  post,
  getBlob,
  get,
  patchFormData
  //   del,
} from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/rewardCard.js',
  _NOTICE: 'rewardCard api'
});

/* [POST] 取得積點卡列表 */
const getRewardCardSettingList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.getRewardCardSettingList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getRewardCardSettingList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得集點卡詳情 */
const getRewardCardSettingDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.getRewardCardSettingDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getRewardCardSettingDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 儲存集點卡詳情 */
const updRewardCardSettingDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.updRewardCardSettingDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updRewardCardSettingDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 刪除集點卡詳情 */
const delRewardCardSettingDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.delRewardCardSettingDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delRewardCardSettingDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得積點卡調整列表 */
const getRewardSendList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.getRewardSendList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getRewardSendList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得集點卡調整詳情 */
const getRewardSendDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.getRewardSendDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getRewardSendDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [patch FormData] 儲存集點卡詳情 */
const updRewardSendDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.updRewardSendDetail}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updRewardSendDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 檢查上傳集點卡發送詳情 */
const uploadRewardSendDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.uploadRewardSendDetail}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'uploadRewardSendDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 刪除集點卡詳情 */
const delRewardSendDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.delRewardSendDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delRewardSendDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET BLOB ] 下載集點發送範本 */
const downloadRewardSendExample = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.downloadRewardSendExample}`;
    const result = await getBlob(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'downloadRewardSendExample', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET ] 取得集點卡下拉式選項 */
const getRewardCardMenu = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.getRewardCardMenu}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'downloadRewardSendExample', _EHS._LEVEL.ERROR);
  }
};

/* [POST] 取得集點明細 */
const getRewardDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.getRewardDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getRewardDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得會員集點明細 */
const getMemberRewardDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.rewardCard.getMemberRewardDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberRewardDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getRewardCardSettingList,
  getRewardCardSettingDetail,
  updRewardCardSettingDetail,
  delRewardCardSettingDetail,
  getRewardSendList,
  getRewardSendDetail,
  updRewardSendDetail,
  delRewardSendDetail,
  downloadRewardSendExample,
  getRewardCardMenu,
  uploadRewardSendDetail,
  getRewardDetail,
  getMemberRewardDetail
};
