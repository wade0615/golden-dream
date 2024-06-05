import { post, get, patch, del } from './sub_services/base';
import config from 'config/config';
import apiPath from './api.path';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/payment.js',
  _NOTICE: 'payment api'
});

/** [GET]取得角色列表 */
const getRoleList = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.getRoleList}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getRoleList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [GET]取得所有權限清單 */
const getAuthItems = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.getAuthItems}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getAuthItems', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]取得角色權限清單 */
const getRolePermissions = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.getRolePermissions}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getRolePermissions', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]取得帳號列表 */
const getAccountList = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.getAccountList}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getAccountList', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [GET]取得事業部選項 */
const getAccountDepart = async () => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.getAccountDepart}`;
    const result = await get(url);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getAccountDepart', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]取得帳號資訊 */
const getAccountInfo = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.getAccountInfo}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'getAccountInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [PATCH]修改帳號資訊 */
const updateAccount = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.updateAccount}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateAccount', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [PATCH]修改帳號狀態 */
const updateAccountState = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.updateAccountState}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateAccountState', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]新增後台帳號 */
const addAccount = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.addAccount}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'addAccount', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [DEL]刪除後台帳號 */
const delAccount = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.deleteAccount}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'delAccount', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [PATCH]編輯角色 */
const updateRoleInfo = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.updateRoleInfo}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateRoleInfo', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]新增角色 */
const addRole = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.addRole}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'addRole', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [POST]複製角色 */
const copyRole = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.copyRole}`;
    const result = await post(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'copyRole', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [DEL]刪除角色 */
const deleteRole = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.deleteRole}`;
    const result = await del(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'deleteRole', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [PATCH]編輯角色狀態 */
const updateRoleState = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.updateRoleState}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateRoleState', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [PATCH]編輯角色清單排序 */
const updateRoleListSort = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.updateRoleListSort}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateRoleListSort', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

/** [PATCH]編輯角色權限 */
const updateRolePermissions = async (params) => {
  try {
    const url = `${config.SERVER_POINT}${apiPath.permission.updateRolePermissions}`;
    const result = await patch(url, params);
    return result;
  } catch (error) {
    _EHS.errorReport(error, 'updateRolePermissions', _EHS._LEVEL.ERROR);
    return Promise.reject(error);
  }
};

export default {
  getRoleList,
  getRolePermissions,
  getAuthItems,
  getAccountList,
  getAccountDepart,
  getAccountInfo,
  updateAccount,
  updateAccountState,
  addAccount,
  delAccount,
  addRole,
  copyRole,
  deleteRole,
  updateRoleInfo,
  updateRoleState,
  updateRoleListSort,
  updateRolePermissions
};
