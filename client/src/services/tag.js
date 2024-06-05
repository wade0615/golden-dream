import {
  post,
  get,
  getBlob,
  del,
  patchFormData,
  patch
} from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/tag.js',
  _NOTICE: 'tag api'
});

/* [POST] 取得標籤列表*/
const getTagList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.getTagList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getTagList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET] 取得標籤下拉選單 */
const getTagMenu = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.getTagMenu}`;
    const result = await get(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getTagMenu', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 新增標籤 */
const addNewTag = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.addNewTag}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'addNewTag', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得標籤詳細資訊 */
const getTagDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.getTagDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delCouponSettingDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 新增標籤資料 */
const insTagData = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.insTagData}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'insTagData', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 停用標籤 */
const stopTagStatus = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.stopTagStatus}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'stopTagStatus', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [DELETE] 刪除標籤 */
const delTagData = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.delTagData}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delTagData', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 匯出標籤會員列表
 */
const downloadTagMember = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.downloadTagMember}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'downloadTagMember', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET] 取得標籤分類列表 */
const getTagGroupList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.getTagGroupList}`;
    const result = await get(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getTagGroupList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 新增/編輯標籤分類管理 */
const insTagGroup = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.insTagGroup}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'insTagGroup', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [DELETE] 刪除標籤分類 */
const delTagGroup = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.delTagGroup}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delTagGroup', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 調整標籤分類排序 */
const updTagGroupSort = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.updTagGroupSort}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updTagGroupSort', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [GET] 下載批量貼標 Excel 範本
 */
const downloadTagDemo = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.downloadTagDemo}`;
    const result = await getBlob(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'downloadTagDemo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 檢查批量匯入 Excel */
const batchAddMemberTagCheck = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.batchAddMemberTagCheck}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'batchAddMemberTagCheck', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 儲存批量匯入 Excel */
const batchAddMemberTagSave = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.batchAddMemberTagSave}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'batchAddMemberTagSave', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 標籤上傳紀錄列表 */
const getTagMemberList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.getTagMemberList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getTagMemberList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 新增會員標籤 */
const addTagMember = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.addTagMember}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'addTagMember', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 移除會員標籤 */
const delTagMember = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.tag.delTagMember}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delTagMember', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getTagList,
  getTagMenu,
  addNewTag,
  getTagDetail,
  insTagData,
  stopTagStatus,
  delTagData,
  getTagGroupList,
  insTagGroup,
  delTagGroup,
  updTagGroupSort,
  downloadTagDemo,
  batchAddMemberTagSave,
  getTagMemberList,
  downloadTagMember,
  batchAddMemberTagCheck,
  addTagMember,
  delTagMember
};
