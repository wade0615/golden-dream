import { post, get, del } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/payment.js',
  _NOTICE: 'payment api'
});

/* [POST]取得支付方式列表 */
const getpaymentList = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.payment.getPaymentList}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getpaymentList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]編輯支付方式 */
const addpayment = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.payment.addPayment}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updatepaymentSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]編輯支付方式 */
const updpaymentDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.payment.updPaymentDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updatepaymentSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]刪除支付方式 */
const delpaymentDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.payment.delPayment}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delpaymentSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]修改支付方式排序 */
const updpaymentSort = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.payment.updPaymentSort}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updpaymentSort', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getpaymentList,
  updpaymentDetail,
  delpaymentDetail,
  updpaymentSort,
  addpayment
};
