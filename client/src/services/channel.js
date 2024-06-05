import { post, get } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/payment.js',
  _NOTICE: 'payment api'
});

/* [POST]取得渠道列表 */
const getChannelList = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.channel.getChannelList}`;
    const result = await post(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getChannelList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]修改渠道順序 */
const updChannelSort = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.channel.updChannelSort}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updChannelSort', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]修改渠內容*/
const updChannelDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.channel.updChannelDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updChannelDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]取得渠道下拉式選單*/
const getChannelMenu = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.channel.getChannelMenu}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getChannelMenu', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getChannelList,
  updChannelSort,
  updChannelDetail,
  getChannelMenu
};
