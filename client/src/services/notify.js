import { patchFormData, postBlob, post, get } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/notify.js',
  _NOTICE: 'notify api'
});

/** [POST]取得通知群組 */
const getNotifyClassList = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.getNotifyClassList}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getNotifyClassList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]編輯群組排序 */
const updNotifyClassRank = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.updNotifyClassRank}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updNotifyClassRank', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]更新群組詳細 */
const updNotifyClassDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.updNotifyClassDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updNotifyClassDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]刪除通知分類 */
const delNotifyClassDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.delNotifyClassDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delNotifyClassDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};
/** [GET]取得通知分類下拉選單 */
const getNotifyClassMenu = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.getNotifyClassMenu}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getNotifyClassMenu', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};
/** [POST]取得通知成員清單 */
const getNotifyMemberList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.getNotifyMemberList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getNotifyMemberList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};
/** [POST]更新通知人員詳細 */
const updNotifyMemberDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.updNotifyMemberDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updNotifyMemberDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};
/** [POST]刪除通知成員 */
const delNotifyMemberDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.delNotifyMemberDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delNotifyMemberDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};
/** [POSTBLOB]下載通知成員EXCEL樣板 */
const downloadNotifyMemberExample = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.downloadNotifyMemberExample}`;
    const result = await postBlob(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'downloadNotifyMemberExample', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};
/** [PATCH]批量新增通知人員名單檢核 */
const uploadAddNotifyMemberDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.uploadAddNotifyMemberDetail}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'uploadAddNotifyMemberDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};
/** [PATCH]批量新增通知人員名單 */
const updBatchAddNotifyMemberDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.updBatchAddNotifyMemberDetail}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updBatchAddNotifyMemberDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};
/** [PATCH]批量刪除人員名單檢核 */
const uploadDelNotifyMemberDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.uploadDelNotifyMemberDetail}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'uploadDelNotifyMemberDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};
/** [PATCH]批量刪除更新人員名單 */
const updBatchDelNotifyMemberDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.notify.updBatchDelNotifyMemberDetail}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updBatchDelNotifyMemberDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getNotifyClassList,
  updNotifyClassRank,
  updNotifyClassDetail,
  delNotifyClassDetail,
  getNotifyClassMenu,
  getNotifyMemberList,
  updNotifyMemberDetail,
  delNotifyMemberDetail,
  downloadNotifyMemberExample,
  uploadAddNotifyMemberDetail,
  updBatchAddNotifyMemberDetail,
  uploadDelNotifyMemberDetail,
  updBatchDelNotifyMemberDetail
};
