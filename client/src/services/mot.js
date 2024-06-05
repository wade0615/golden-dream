import {
  postBlob,
  get,
  patch,
  patchFormData,
  post,
  del
} from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/mot.js',
  _NOTICE: 'mot api'
});

/* [POST]匯出單筆群發紀錄 */
const exportSendLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.exportSendLog}`;
    const result = await postBlob(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'exportSendLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]取得群發通用設定 */
const getMotCommonSetting = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.getMotCommonSetting}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMotCommonSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH]編輯群發通用設定 */
const updateMotCommonSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.updateMotCommonSetting}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateMotCommonSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]取得 MOT 設定列表 */
const getMotSettingList = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.getMotSettingList}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMotSettingList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH]啟用/停用 MOT 事件 */
const updateMotState = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.updateMotState}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateMotState', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]取得 MOT 設定資訊 */
const getMotSettingInfo = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.getMotSettingInfo}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMotSettingInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]取得事件設定所需參數 */
const getMotSettingParameter = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.getMotSettingParameter}`;
    const result = await postBlob(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMotSettingParameter', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH]編輯建立條件 */
const updateMotSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.updateMotSetting}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateMotSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH]編輯發送內容設定 */
const updateMotContentSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.updateMotContentSetting}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateMotContentSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 新增/編輯群發條件 */
const updateMotClusterSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.updateMotClusterSetting}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateMotClusterSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 新增/編輯群發發送內容設定 */
const updateMotClusterContent = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.updateMotClusterContent}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateMotClusterContent', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得群發內容資訊 */
const getMotClusterInfo = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.getMotClusterInfo}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMotClusterInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得群發列表 */
const getMotClusterList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.getMotClusterList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMotClusterList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]測試發送 */
const sendTest = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.sendTest}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'sendTest', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]取得群發紀錄 */
const getSendLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.getSendLog}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getSendLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 群設定測試發送 */
const clusterSendTest = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.clusterSendTest}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'clusterSendTest', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 停用群設定測試 */
const stopMotCluster = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.stopMotCluster}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'stopMotCluster', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [DELETE] 停用群設定測試 */
const deleteMotCluster = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.mot.deleteMotCluster}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'deleteMotCluster', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  exportSendLog,
  getMotCommonSetting,
  updateMotCommonSetting,
  getMotSettingList,
  updateMotState,
  getMotSettingInfo,
  getMotSettingParameter,
  updateMotSetting,
  updateMotClusterSetting,
  updateMotContentSetting,
  updateMotClusterContent,
  getMotClusterInfo,
  getMotClusterList,
  sendTest,
  getSendLog,
  clusterSendTest,
  stopMotCluster,
  deleteMotCluster
};
