import { post } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/commodity.js',
  _NOTICE: 'commodity api'
});

/* [POST]取得商品列表 */
const getCommodityList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.commodity.getCommodityList}`;
    const result = await post(url, params);

    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getpaymentList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getCommodityList
};
