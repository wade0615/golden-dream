import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'utils/localStorageUtil.js',
  _NOTICE: ''
});

/**
 * set key value in local storage.
 * @param {string} key
 * @param {and} value
 */

const PRE_TEXT = 'personal_';

const setItem = (
  key,
  value,
  ttl = 60 * 60 * 1000 // 1hr
) => {
  try {
    // localStorage.setItem(PRE_TEXT + key, JSON.stringify(value));
    const now = new Date();

    // `item` 是包含 儲存內容 和 過期時間
    const item = {
      value: value,
      expiry: now.getTime() + ttl // 過期時間為當前時間 + TTL（毫秒）
    };

    localStorage.setItem(PRE_TEXT + key, JSON.stringify(item));
  } catch (error) {
    console.log('[ERROR] setItem :');
    console.log(error);
    _EHS.errorReport(error, 'setItem', _EHS._LEVEL.ERROR);
  }
};

/**
 * get value from local storage, if null return null.
 * @param {string} key
 * @returns
 */
const getItem = (key) => {
  try {
    const itemStr = localStorage.getItem(PRE_TEXT + key);
    if (!itemStr || itemStr === null) {
      return null;
    } else {
      const item = JSON.parse(itemStr);
      const now = new Date();

      // 檢查是否過期
      if (now.getTime() > item.expiry) {
        // 如果過期，刪除數據並返回 null
        localStorage.removeItem(key);
        return null;
      }

      return item.value; // 返回未過期的數據
    }
  } catch (error) {
    console.log(`${key} 取得參數失敗`);
    _EHS.errorReport(error, 'getItem', _EHS._LEVEL.ERROR);
    return null;
  }
};

/**
 * remove.
 * @param {string} key
 */
const removeItem = (key) => {
  try {
    localStorage.removeItem(PRE_TEXT + key);
  } catch (error) {
    _EHS.errorReport(error, 'removeItem', _EHS._LEVEL.ERROR);
  }
};

const cleanAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    _EHS.errorReport(error, 'removeItem', _EHS._LEVEL.ERROR);
  }
};

export default { setItem, getItem, removeItem, cleanAll };
