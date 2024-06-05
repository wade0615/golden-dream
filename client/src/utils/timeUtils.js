// import { format, add } from 'date-fns';
import { DEF_TIME_ZONE } from 'config/config';

//  上個月最後一天
// function getLastDayOfPreviousMonth() {
//   const today = new Date(); // 現在的日期
//   const lastDayOfPreviousMonth = new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     0
//   );
//   return lastDayOfPreviousMonth;
// }

// const formatTime = (date = null, isTime = false, isDay = true) => {
//   let _tempTime;
//   typeof date === 'string'
//     ? (_tempTime = new Date(date))
//     : typeof date === 'object' && date !== null
//     ? (_tempTime = date)
//     : (_tempTime = new Date());
//   return isTime
//     ? format(_tempTime, 'yyyy/MM/dd HH:mm')
//     : isDay
//     ? format(_tempTime, 'yyyy/MM/dd')
//     : format(_tempTime, 'yyyy/MM');
// };

// const formatTwTime = (date = null, isTime = false, isDay = true) => {
//   let _tempTime;
//   typeof date === 'string'
//     ? (_tempTime = add(new Date(date), { hours: 8 }))
//     : (_tempTime = add(new Date(), { hours: 8 }));
//   return isTime
//     ? format(_tempTime, 'yyyy/MM/dd HH:mm')
//     : isDay
//     ? format(_tempTime, 'yyyy/MM/dd')
//     : format(_tempTime, 'yyyy/MM');
// };

/**
 * Description 新版時間格式定義
 * @param {any} dateStr - 時間資料。
 * @param {Object} options - 包含 isStart、isUTC、formatString。
 * @param {boolean} options.isStart - 設置為當天開始 true 或結束時間 false，預設 null。
 * @param {boolean} options.isUTC - 設置 UTC+0 時間，預設 false。
 * @param {string} options.formatString - 時間格式處理，預設 yyyy/MM/dd。
 * 有 'yyyy/MM'、'yyyy/MM/dd'、'yyyy-MM-dd'、'yyyy/MM/dd HH:mm'、'yyyy/MM/dd HH:mm:ss'
 * @returns {any} Date string
 */
const formatDefTimeNew = (dateStr = '', options = {}) => {
  // config.timeformat.yyyymmdd_hhmmss
  const {
    isStart = null,
    isUTC = false,
    formatString = 'yyyy/MM/dd'
  } = options;
  if (!dateStr) return '';
  let date = new Date(dateStr);
  date = new Date(date.getTime() + DEF_TIME_ZONE * 3600 * 1000);

  // 根據 isStart 設置為當天開始或結束時間
  if (isStart === true) {
    date.setUTCHours(0, 0, 0, 0); // 設置為當天開始
  } else if (isStart === false) {
    date.setUTCHours(23, 59, 59, 999); // 設置為當天結束
  }

  if (isUTC) {
    const offset = date.getTimezoneOffset() / 60;
    date.setUTCHours(date.getUTCHours() + offset);
  }

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  if (formatString === 'yyyy/MM') {
    return `${year}/${month}`;
  } else if (formatString === 'yyyy/MM/dd') {
    return `${year}/${month}/${day}`;
  } else if (formatString === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`;
  } else if (formatString === 'yyyy/MM/dd HH:mm') {
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  } else if (formatString === 'yyyy/MM/dd HH:mm:ss') {
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  } else if (formatString === 'yyyyMMdd') {
    return `${year}${month}${day}`;
  }
};

/**
 * Description 開始結束日期格式
 * @param {any} date - 時間資料。
 * isUTC 固定為 true。formatString 固定為 'yyyy/MM/dd HH:mm:ss'
 * @param {boolean} isStart - 設置為當天開始 true 或結束時間 false。
 * @returns {any} Date string
 */
const formatStartEndDate = (date, isStart) => {
  return formatDefTimeNew(date, {
    isStart: isStart,
    isUTC: true,
    formatString: 'yyyy/MM/dd HH:mm:ss'
  });
};

// 沒變更時區的時間轉換
// const formatTimeNoZone = (dateStr = '', isDay = true) => {
//   // 檢查日期字符串是否為空
//   if (!dateStr) return '';
//   // 將 ISO 8601 格式的日期時間轉換為 yyyy/MM/dd HH:mm:ss
//   // 直接使用字符串操作來實現，避免時區影響
//   const date = dateStr.replace('T', ' ').replace(/\.\d+Z$/, '');
//   const [yyyy, MM, dd, HH, mm] = date.split(/[- :]/);
//   return isDay ? `${yyyy}/${MM}/${dd}` : `${yyyy}/${MM}/${dd} ${HH}:${mm}`;
// };

/**
 * Description
 * @param {any} dateStr=''
 * @returns {any} Date object
 */
// const endOfTheDay = (dateStr = '', isTime = false) => {
//   if (dateStr === '') return '';
//   // Step 1: Get the current date
//   const now = dateStr ? new Date(dateStr) : new Date();
//   // Step 2: Set the time portion to 23:59:59
//   now.setHours(23);
//   now.setMinutes(59);
//   now.setSeconds(59);
//   now.setMilliseconds(999);

//   return isTime
//     ? format(now, 'yyyy/MM/dd HH:mm')
//     : format(now, 'yyyy/MM/dd HH:mm:ss');
// };

// const startOfTheDay = (dateStr = '', isTime = false) => {
//   if (dateStr === '') return '';
//   // Step 1: Get the current date
//   const now = dateStr ? new Date(dateStr) : new Date();
//   // Step 2: Set the time portion to 23:59:59
//   now.setHours(0);
//   now.setMinutes(0);
//   now.setSeconds(0);
//   now.setMilliseconds(0);

//   return isTime
//     ? format(now, 'yyyy/MM/dd HH:mm')
//     : format(now, 'yyyy/MM/dd HH:mm:ss');
// };

// const endOfTwTheDay = (dateStr = '', isTime = false) => {
//   if (dateStr === '') return '';
//   let now = new Date(dateStr);
//   // 將日期調整為 UTC+8，但首先確保以 UTC 時間解讀輸入
//   now = new Date(now.getTime() + 8 * 60 * 60 * 1000);
//   // 格式化日期和時間
//   const year = now.getUTCFullYear();
//   const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
//   const day = now.getUTCDate().toString().padStart(2, '0');
//   const hours = '23';
//   const minutes = '59';

//   return isTime
//     ? `${year}/${month}/${day} ${hours}:${minutes}`
//     : `${year}/${month}/${day}`;
// };

// const startOfTwTheDay = (dateStr = '', isTime = false) => {
//   if (dateStr === '') return '';
//   let now = new Date(dateStr);
//   // 將日期調整為 UTC+8，但首先確保以 UTC 時間解讀輸入
//   now = new Date(now.getTime() + 8 * 60 * 60 * 1000);
//   // 格式化日期和時間
//   const year = now.getUTCFullYear();
//   const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
//   const day = now.getUTCDate().toString().padStart(2, '0');
//   const hours = '00';
//   const minutes = '00';

//   return isTime
//     ? `${year}/${month}/${day} ${hours}:${minutes}`
//     : `${year}/${month}/${day}`;
// };

/* 選擇時間區間 */
const rangeDate = (dayCounts, startDate = new Date()) =>
  new Date(new Date().setDate(startDate.getDate() + Number(dayCounts)));

export {
  // endOfTheDay,
  // startOfTheDay,
  // endOfTwTheDay,
  // startOfTwTheDay,
  // formatTime,
  // formatTwTime,
  formatDefTimeNew,
  formatStartEndDate,
  // formatTimeNoZone,
  rangeDate
  // getLastDayOfPreviousMonth
};
