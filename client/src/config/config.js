import _configValueSwitch from './config.value';

/** 檢查使用者登入狀態控制開關 */
export const CHECK_LOGIN = false;
/** 頁面 檢查使用者權限 控制開關 */
export const PAGE_CHECK_AUTH = false;
/** 功能 檢查使用者權限 控制開關 */
export const FUNCTION_CHECK_AUTH = false;
/** 側邊欄 檢查使用者權限 控制開關 */
export const SIDE_MENU_CHECK_AUTH = false;
/** 側邊欄預設狀態 true 展開 false 縮小 */
export const SIDE_MENU_IS_OPEN = false;
/** 預設時區 */
export const DEF_TIME_ZONE = 8;

let NOW_ENV = 'LOCAL';
if (process.env.REACT_APP_ENV)
  // dockerfile build 的時候替換環境
  NOW_ENV = process.env.REACT_APP_ENV;

export const keys = {
  SERVER_POINT: 'SERVER_POINT'
};
const _valueSwitch = (value) => {
  return _configValueSwitch(value, NOW_ENV);
};

const config = {};
Object.keys(keys).forEach((key) => {
  config[key] = _valueSwitch(key);
});

export default config;
