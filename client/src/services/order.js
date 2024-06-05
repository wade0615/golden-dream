import { postBlob, get, post } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/order.js',
  _NOTICE: 'order api'
});

/* [POST]補登訂單資料 */
const exportOrderDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.exportOrderDetail}`;
    const result = await postBlob(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'exportOrderDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [GET] 積點明細下拉篩選資料
 */
const getPointLogFilterOptions = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.getPointLogFilterOptions}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getPointLogFilterOptions', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/**
 * [POST] 取得積點明細列表
 */
const getPointLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.getPointLog}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getPointLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]匯出積點明細 */
const exportPointLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.exportPointLog}`;
    const result = await postBlob(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'exportPointLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]取得會員消費明細 */
const getMemberOrderLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.getMemberOrderLog}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberOrderLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]取得訂單記錄 */
const getOrderLog = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.getOrderLog}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getOrderLog', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]取得訂單詳情 */
const getOrderDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.getOrderDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getOrderDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]補登訂單資料 */
const addOrderDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.addOrderDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'addOrderDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]依交易編號取得訂單詳情 */
const getOrderDetailByTransactionId = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.getOrderDetailByTransactionId}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getOrderDetailByTransactionId', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得匯出資料列表 */
const getOrderExportList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.order.getOrderExportList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getOrderExportList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  exportOrderDetail,
  getPointLogFilterOptions,
  getPointLog,
  exportPointLog,
  getMemberOrderLog,
  getOrderLog,
  getOrderDetail,
  addOrderDetail,
  getOrderDetailByTransactionId,
  getOrderExportList
};
