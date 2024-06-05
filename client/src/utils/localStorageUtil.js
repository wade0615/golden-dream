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

const PRE_TEXT = 'crm_';

const setItem = (key, value) => {
  try {
    localStorage.setItem(PRE_TEXT + key, JSON.stringify(value));
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
    if (
      !localStorage.getItem(PRE_TEXT + key) ||
      localStorage.getItem(PRE_TEXT + key) === null
    ) {
      return null;
    } else {
      return JSON.parse(localStorage.getItem(PRE_TEXT + key));
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
