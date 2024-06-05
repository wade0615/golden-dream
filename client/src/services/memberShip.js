import { post, get, put, del, patch } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/memberShip.js',
  _NOTICE: 'memberShip api'
});

/* [GET] 取得會籍清單 */
const getMemberShipSettingList = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.getMemberShipSettingList}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberShipSettingList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [GET] 取得會籍下拉式選項 */
const getMemberShipMenu = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.getMemberShipMenu}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberShipMenu', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [ PUT ] 拷貝會籍設定*/
const copyMemberShipSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.copyMemberShipSetting}`;
    const result = await put(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'copyMemberShipSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [ Delete ] 刪除會籍設定*/
const delMemberShipSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.delMemberShipSetting}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delMemberShipSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [ POST ] 生效會籍設定*/
const releaseMemberShipSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.releaseMemberShipSetting}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'releaseMemberShipSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [ POST ] 取得會籍設定資料*/
const getMemberShipSettingInfo = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.getMemberShipSettingInfo}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberShipSettingInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 取得會籍下拉式 */
const getMemberSettingParameter = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.getMemberSettingParameter}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberSettingParameter', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST ] 通用設定儲存/草稿/發佈 */
const memberShipSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.memberShipSetting}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getMemberSpecialTypeMenu', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 會籍設定儲存/草稿/發佈 */
const memberShip = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.memberShip}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'memberShip', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [PATCH] 生效中通用設定儲存 */
const activeMemberShipSetting = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.activeMemberShipSetting}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'activeMemberShipSetting', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/* [POST] 生效中會籍儲存 */
const activeMemberShip = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.memberShip.activeMemberShip}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'activeMemberShip', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getMemberShipSettingList,
  getMemberShipMenu,
  memberShipSetting,
  copyMemberShipSetting,
  delMemberShipSetting,
  releaseMemberShipSetting,
  getMemberShipSettingInfo,
  getMemberSettingParameter,
  memberShip,
  activeMemberShipSetting,
  activeMemberShip
};
