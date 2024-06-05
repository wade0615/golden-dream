import { post, getBlob, patchFormData } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/holiday.js',
  _NOTICE: 'holiday api'
});

/* [POST]取得假日設定列表 */
const getHolidaySettingList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.holiday.getHolidaySettingList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getHolidaySettingList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET]下載假日設定範本 */
const downloadHolidayExample = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.holiday.downloadHolidayExample}`;
    const result = await getBlob(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'downloadHolidayExample', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]匯入 Excel 假日設定資料 */
const uploadHolidaySetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.holiday.uploadHolidaySetting}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'uploadHolidaySetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST]儲存 Excel 假日設定資料 */
const updBatchHolidaySetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.holiday.updBatchHolidaySetting}`;
    const result = await patchFormData(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updBatchHolidaySetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getHolidaySettingList,
  downloadHolidayExample,
  uploadHolidaySetting,
  updBatchHolidaySetting
};
