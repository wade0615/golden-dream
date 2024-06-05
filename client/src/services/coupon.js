import { post, getBlob, patchFormData } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/coupon.js',
  _NOTICE: 'coupon api'
});

/* [POST]取得兌換券設定列表 */
const getCouponSettingList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.getCouponSettingList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getCouponSettingList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得兌換券設定詳細資料 */
const getCouponSettingDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.getCouponSettingDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getCouponSettingDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 修改兌換券詳細資料 */
const updCouponSettingDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.updCouponSettingDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updCouponSettingDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 修改兌換券詳細資料 */
const delCouponSettingDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.delCouponSettingDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delCouponSettingDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]取得兌換券發放列表 */
const getCouponSendList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.getCouponSendList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getCouponSendList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得兌換券發放詳細資料 */
const getCouponSendDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.getCouponSendDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getCouponSendDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [GET] 下載優惠券範本
 */
const downloadCouponSendExample = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.downloadCouponSendExample}`;
    const result = await getBlob(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'downloadCouponSendExample', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 修改兌換券詳細資料 */
const updCouponSendDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.updCouponSendDetail}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updCouponSendDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 刪除兌換券發放詳細資料 */
const delCouponSendDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.delCouponSendDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delCouponSettingDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 掃碼取得 coupon 資料 */
const getMemberCouponDetailByRedeemId = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.getMemberCouponDetailByRedeemId}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(
      error,
      'getMemberCouponDetailByRedeemId',
      _EHS._LEVEL.ERROR
    );
    return Promise.reject(error);
  }
};

/* [POST] 核銷 優惠券/商品券 */
const writeOffCouponDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.writeOffCouponDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'writeOffCouponDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得兌換券明細列表 */
const getCouponDetailList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.getCouponDetailList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getCouponDetailList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 退貨兌換券 */
const refundCouponDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.refundCouponDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'refundCouponDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得會員兌換券明細列表 */
const getMemberCouponDetailList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.coupon.getMemberCouponDetailList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberCouponDetailList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getCouponSettingList,
  getCouponSettingDetail,
  updCouponSettingDetail,
  delCouponSettingDetail,
  getCouponSendList,
  getCouponSendDetail,
  downloadCouponSendExample,
  updCouponSendDetail,
  delCouponSendDetail,
  getMemberCouponDetailByRedeemId,
  writeOffCouponDetail,
  getCouponDetailList,
  refundCouponDetail,
  getMemberCouponDetailList
};
