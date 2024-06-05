import { post } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/report.js',
  _NOTICE: 'report api'
});

/* [POST] 取得報表匯出列表 */
const getReportExportList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.report.getReportExportList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getReportExportList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 下載報表 */
const downloadReportExport = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.report.downloadReportExport}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'downloadReportExport', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getReportExportList,
  downloadReportExport
};
