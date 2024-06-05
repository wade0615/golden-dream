import { get, post } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/cluster.js',
  _NOTICE: 'cluster api'
});

/* [GET]取得分群通用設定 */
const getClusterCommonSetting = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.cluster.getClusterCommonSetting}`;
    const result = await get(url);

    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getClusterCommonSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]  修改分群通用設定 */
const updClusterCommonSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.cluster.updClusterCommonSetting}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updClusterCommonSetting', _EHS._LEVEL.ERROR);
  }
};

/* [POST]  取得分群設定列表 */
const getClusterSettingList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.cluster.getClusterSettingList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getClusterSettingList', _EHS._LEVEL.ERROR);
  }
};

/* [POST]取得分群下載列表 */
const getClusterDownloadList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.cluster.getClusterDownloadList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getClusterDownloadList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得分群設定明細 */
const getClusterSettingDetail = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.cluster.getClusterSettingDetail}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getClusterSettingDetail', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 更新分群設定 */
const updClusterSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.cluster.updClusterSetting}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updClusterSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 計算分群觸及人數 */
const countClusterMember = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.cluster.countClusterMember}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'countClusterMember', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 停用分群設定 */
const stopClusterSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.cluster.stopClusterSetting}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'stopClusterSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 刪除分群設定 */
const delClusterSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.cluster.delClusterSetting}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delClusterSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getClusterCommonSetting,
  getClusterDownloadList,
  updClusterCommonSetting,
  getClusterSettingList,
  getClusterSettingDetail,
  updClusterSetting,
  countClusterMember,
  stopClusterSetting,
  delClusterSetting
};
