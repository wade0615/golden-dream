import {
  post,
  postBlob,
  getBlob,
  patchFormData,
  get
} from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/member.js',
  _NOTICE: 'member api'
});

/**
 * Description  取得會員列表
 * @param { string } search 搜尋欄
 * @param { string } startDate 開始日期
 * @param { string } endDate 結束日期
 * @param { number } memberSpecialType 特殊會員類型
 * @param { string } membershipStatus: 0 會籍類型
 * @param { number } page: 1 	當前頁數
 * @param { number } perPage: 20 每頁幾筆
 */
const getMemberList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST ]  取得會員特殊類型下拉式選單*/
const getMemberSpecialTypeMenu = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberSpecialTypeMenu}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberSpecialTypeMenu', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST BLOB ]  匯出會員列表*/
const exportMemberList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.exportMemberList}`;
    const result = await postBlob(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'exportMemberList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]  新增會員詳細資料*/
const addMemberDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.addMemberDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'addMemberDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]  取得會員特殊類型列表*/
const getMemberSpecialList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberSpecialList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberSpecialList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]  修改會員特殊類型順序 */
const updMemberSpecialRank = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.updMemberSpecialRank}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updMemberSpecialRank', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]  修改會員特殊類型詳細資料 */
const updMemberSpecialDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.updMemberSpecialDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updMemberSpecialDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]  刪除會員特殊類型 */
const delMemberSpecialDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.delMemberSpecialDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delMemberSpecialDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH]   匯入Excel 特殊會員類型 */
const uploadMemberMobile = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.uploadMemberMobile}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'uploadMemberMobile', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH]   匯入Excel 特殊會員類型 */
const updBatchMemberSpecialType = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.updBatchMemberSpecialType}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updBatchMemberSpecialType', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 取得會員共用資料
 */
const getMemberCommonData = async (memberId) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberCommonData}`;
    const result = await post(url, { memberId });
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberCommonData', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 取得會員詳細資料
 */
const getMemberDetail = async (memberId) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberDetail}`;
    const result = await post(url, { memberId });
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberDetailByMobile', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 以電話取得會員詳細資料
 */
const getMemberDetailByMobile = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberDetailByMobile}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberDetailByMobile', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 更新會員資料
 */
const updMemberDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.updMemberDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updatedMemberDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 後台用設定會員密碼
 */
const updateMemberPassword = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.updateMemberPassword}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateMemberPassword', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 重新發送驗證碼
 */
const resendSms = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.resendSms}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'resendSms', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [GET] 下載特殊會員範本
 */
const downloadMemberSpecialTypeExample = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.downloadMemberSpecialTypeExample}`;
    const result = await getBlob(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(
      error,
      'downloadMemberSpecialTypeExample',
      _EHS._LEVEL.ERROR
    );
    return Promise.reject(error);
  }
};

/**
 * [POST]
 **/
const exportAssignMemberList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.exportAssignMemberList}`;
    const result = await postBlob(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'exportAssignMemberList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [GET] 取得會員積點歷程下單選項
 */
const getMemberPointFilterOptions = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberPointFilterOptions}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberPointFilterOptions', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 取得會員積點歷程
 **/
const getMemberPointLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberPointLog}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberPointLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 取得會員會籍歷程
 **/
const getMemberShipLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberShipLog}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberShipLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 取得會員總覽分析
 **/
const getOverviewAnalysis = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getOverviewAnalysis}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getOverviewAnalysis', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 取得會員訂位資訊
 **/
const getMemberBookingLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberBookingLog}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberBookingLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 取得會員電子票卷紀錄
 **/
const getMemberEcVoucherLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberEcVoucherLog}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberEcVoucherLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 取得會員電子票卷詳細資料
 **/
const getMemberEcVoucherInfo = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.getMemberEcVoucherInfo}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberEcVoucherInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 生效中通用設定儲存 */
const chkUploadMemberMobile = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.chkUploadMemberMobile}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'chkUploadMemberMobile', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 生效中通用設定儲存 to Csv */
const chkUploadMobileCsv = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.member.chkUploadMobileCsv}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'chkUploadMobileCsv', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getMemberList,
  getMemberSpecialTypeMenu,
  exportMemberList,
  addMemberDetail,
  getMemberSpecialList,
  updMemberSpecialRank,
  updMemberSpecialDetail,
  delMemberSpecialDetail,
  uploadMemberMobile,
  updBatchMemberSpecialType,
  getMemberCommonData,
  getMemberDetailByMobile,
  updMemberDetail,
  getMemberDetail,
  updateMemberPassword,
  resendSms,
  downloadMemberSpecialTypeExample,
  exportAssignMemberList,
  getMemberPointFilterOptions,
  getMemberPointLog,
  getMemberShipLog,
  getOverviewAnalysis,
  getMemberBookingLog,
  getMemberEcVoucherLog,
  getMemberEcVoucherInfo,
  chkUploadMemberMobile,
  chkUploadMobileCsv
};
