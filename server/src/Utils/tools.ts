import { HttpStatus } from '@nestjs/common';
import { randomBytes } from 'crypto';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
const crypto = require('crypto');
import moment = require('moment-timezone');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sizeOf = require('image-size');

export const sha256Hash = (input: string, key: string) => {
  const timestime = new Date().getTime();
  const hash = crypto.createHash('sha256');
  hash.update(`${input}:${key}:${timestime}`);
  return hash.digest('hex');
};

export const UTCToTimeString = (tStr) => {
  if (!tStr) return null;
  const date = new Date(tStr);
  const Y = date.getFullYear();
  const M =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const m =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const s =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

  const dateTimeStr = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
  return dateTimeStr;
};

export const getRandomOneChar = () => {
  return randomBytes(4).toString('base64').charAt(0);
};

/**
 * return by length
 * @param length
 */
export const getRandomString = (length) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += getRandomOneChar();
  }
  return result;
};

export const timeStringToUTCdate = (tStr) => {
  if (!tStr) return null;
  const isoDateString = new Date(tStr).toISOString();
  const newD = new Date(isoDateString);
  return newD;
};

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default {
  getRandomOneChar,
  getRandomString,
  timeStringToUTCdate,
  sleep
};

/**
 * 日期字串轉換成date類型
 * @param dateStr  日期字串
 * @returns
 */
export const transformDate = (dateStr) => {
  if (dateStr.indexOf('-') > -1) {
    return new Date(dateStr.replace(/\-/g, '/'));
  }
  if (dateStr.indexOf('/') > -1) {
    return new Date(dateStr.replace(/\//g, '/'));
  }
  if (dateStr.indexOf('.') > -1) {
    return new Date(dateStr.replace(/\./g, '/'));
  }

  return new Date(dateStr);
};

/**
 * 判斷被「檢核的開始日期」、「被檢核的結束日期」是否在時間區間內
 * @param startDate 開始日期
 * @param endDate  結束日期
 * @param checkStartDate 被檢核的開始日期
 * @param checkEndDate  被檢核的結束日期
 * @returns
 */
export const checkDateInFixedDates = (
  startDate,
  endDate,
  checkStartDate,
  checkEndDate
) => {
  if (
    startDate == '' ||
    endDate == '' ||
    checkStartDate == '' ||
    checkEndDate == ''
  ) {
    return;
  }
  const dateStart = transformDate(startDate);
  const dateEnd = transformDate(endDate);
  const dateStartCheck = transformDate(checkStartDate);
  const dateEndCheck = transformDate(checkEndDate);

  if (
    dateStartCheck >= dateStart &&
    dateStartCheck <= dateEnd &&
    dateEndCheck >= dateStart &&
    dateEndCheck <= dateEnd
  ) {
    // 查詢日期在給定日期範圍內
    return true;
  } else {
    // 查詢日期不在給定日期範圍內
    return false;
  }
};

/**
 * 取得日期區間全部日期
 * @param start
 * @param end
 * @returns
 */
export const getDate = (start, end) => {
  const arr = [];
  for (
    let dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt).toLocaleDateString());
  }

  return arr;
};

/**
 * 時間格式斜線替換  / 替換成 -
 * @param dateStr  日期字串
 * @returns
 */
export const transformDateFormat = (dateStr) => {
  if (dateStr.indexOf('/') > -1) {
    return dateStr.replace(/\//g, '-');
  }
  return dateStr;
};

/**
 * 偵測兩個時間區段是否重疊，true 重疊，false 沒有重疊
 * @param startA
 * @param endA
 * @param startB
 * @param endB
 * @returns
 */
export const checkTimeOverlap = (startA, endA, startB, endB) => {
  if (!startA || !endA || !startB || !endB) return false;
  // string => Date 格式
  const newStartA = new Date(transformDateFormat(startA)).getTime();
  const newEndA = new Date(transformDateFormat(endA)).getTime();

  const newStartB = new Date(transformDateFormat(startB)).getTime();
  const newEndB = new Date(transformDateFormat(endB)).getTime();

  return newEndA >= newStartB && newStartA <= newEndB;
};

/**
 * 偵測兩個時間區段是否重疊，但起訖時間可相等，true 重疊，false 沒有重疊
 * @param startA
 * @param endA
 * @param startB
 * @param endB
 * @returns
 */
export const checkTimeOverlapExcludeStartEnd = (startA, endA, startB, endB) => {
  if (!startA || !endA || !startB || !endB) return false;
  // string => Date 格式
  const newStartA = new Date(transformDateFormat(startA)).getTime();
  const newEndA = new Date(transformDateFormat(endA)).getTime();

  const newStartB = new Date(transformDateFormat(startB)).getTime();
  const newEndB = new Date(transformDateFormat(endB)).getTime();

  return newEndA > newStartB && newStartA < newEndB;
};

/**
 * 處理 csv 保留字元
 * * 處理內容中的雙引號字元，並回傳包裹後的內容 ( 2 個雙引號可正常顯示 )
 * * 頭尾以 "" 包裹保留獨立排版欄位
 * @param originString
 * @returns
 */
export const handleCsvReservedWords = (originString: string | number) => {
  const text = `"${originString}"`;
  return text?.toString().replace(/(?<!^)\"(?!$)/g, '""');
};

/**
 * 取得隨機字串
 * @param length
 * @returns
 */
export const getRandomChar = (length) => {
  let result = '';
  const characters =
    '0123456789qazwsxedcrfvtgbyhnujmikolpQAZWSXEDCRFVTGBYHNUJMIKOLP';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
};

/**
 * 產出隨機長度5的 salt
 * @returns
 */
export const genSalt = () => {
  const randomSalt = crypto
    .randomBytes(Math.ceil(5 / 2))
    .toString(config._HASH_METHOD._HEX)
    .slice(0, 5);
  return randomSalt;
};

/**
 * 取得 salt + 密碼加密後結果
 * @param password
 * @param salt
 */
export const cryptoPwd = (password: string, salt: string) => {
  const hashPassword = crypto
    .createHash(config._HASH_METHOD._SHA256)
    .update(password)
    .digest(config._HASH_METHOD._HEX)
    .toUpperCase();
  const saltPassword = salt + hashPassword;
  return saltPassword;
};

/**
 * 若第一個電話是 0 去除
 * @param mobile 電話
 * @returns
 */
export const removeFirstZero = (mobile) => {
  if (mobile?.charAt(0) === '0') {
    return mobile.substring(1);
  }
  return mobile;
};

/**
 * 若第一個手機國碼是 + 就直接回傳，否則補一個 +
 * @param mobileCountryCode 手機國碼
 * @returns
 */
export const repairCountryCode = (mobileCountryCode) => {
  if (!mobileCountryCode || mobileCountryCode?.charAt(0) === '+') {
    return mobileCountryCode;
  }

  return `+${mobileCountryCode}`;
};

/**
 * 取得隨機數字
 * @param length
 * @returns
 */
export const getRandomNumber = (length) => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export const joinErrorMsg = (errorMsg: string[]) => {
  const errorMsgStr = errorMsg.join('^&');

  return errorMsgStr;
};

/** 檢核圖檔類型是否正確
 * @param {Express.Multer.File[]} files
 * @return {boolean} isValid
 */
export const checkImageType = (files: Express.Multer.File[]): boolean => {
  // accept type : PNG, JPEG, JPG, GIF
  // convert buffer to file_signatures
  const jpg = ['ffd8ffe0', 'ffd8ffdb', 'ffd8ffee', 'ffd8ffe1', 'ffd8ffe2'];
  const png = ['89504e47'];
  const gif = ['47494638'];
  const acceptList = [...jpg, ...png, ...gif];
  const isValid = files.some((f) => {
    let signature = '';
    for (let i = 0; i < 4; i++) {
      signature += f.buffer[i].toString(16);
    }

    if (!acceptList.includes(signature)) {
      return false;
    }
    return true;
  });

  return isValid;
};

/**
 * 檢核檔案尺寸與檔案大小
 * @param param0
 * @returns
 */
export const validateImage = async ({
  files,
  maxHeight = 640,
  maxWidth = 640,
  maxMb = 1
}: {
  files: Express.Multer.File[];
  maxHeight: null | number;
  maxWidth: null | number;
  maxMb: null | number;
}) => {
  const fileList = Array.from(files);
  let isAllImageValid = true;

  for (let i = 0; i < fileList.length; i++) {
    const isValid = await check(fileList[i]);
    if (!isValid) {
      isAllImageValid = false;
      return;
    }
  }

  return isAllImageValid;

  async function check(f: Express.Multer.File) {
    const maxByte = (maxMb ?? 0) * 1024 * 1024;

    //檢核檔案大小
    if (maxByte && f.size > maxByte) {
      throw new CustomerException(
        {
          code: configError._310003.code,
          msg: `${configError._310003.msg}${maxMb} MB，請重新上傳。`
        },
        HttpStatus.OK
      );
    }

    if (files?.[0]?.mimetype?.includes('octet-stream')) return true;

    //檢核圖片尺寸
    const imgSize = sizeOf(f.buffer);
    if (
      (maxHeight && imgSize.height > maxHeight) ||
      (maxWidth && imgSize.width > maxWidth)
    ) {
      throw new CustomerException(
        {
          code: configError._310004.code,
          msg: `${configError._310004.msg} ${maxHeight} * ${maxWidth}，請重新上傳。`
        },
        HttpStatus.OK
      );
    }

    return true;
  }
};

/**
 * 創建多個指定編號
 *
 * @param currentCardNumber
 * @returns
 */
export const generateSerialNumber = (
  prefix: string,
  seq: number,
  limit: number
): string[] => {
  const cards = [];
  let counter = 1;

  while (counter <= 1000) {
    seq++;
    cards.push(`${prefix}${seq.toString().padStart(limit, '0')}`);
    counter++;
  }

  return cards;
};

/**
 * 取得日期區間內 log 表的名稱
 * @param preName log 表前綴
 * @param startDate
 * @param endDate
 * @returns
 */
export const getLogTableNameByMonth = (
  preName: string,
  startDate: string,
  endDate: string
) => {
  const start = getLogTableMonth(
    startDate.substring(0, 4),
    parseInt(startDate.substring(5, 7))
  );

  const end = getLogTableMonth(
    endDate.substring(0, 4),
    parseInt(endDate.substring(5, 7))
  );

  const startYear = parseInt(start.substring(0, 4));
  const startMonth = parseInt(start.substring(4, 7));
  const endYear = parseInt(end.substring(0, 4));
  const endMonth = parseInt(end.substring(4, 7));

  const tableNames = [];

  for (let year = startYear; year <= endYear; year++) {
    let startMonthOfYear = 1;
    let endMonthOfYear = 12;

    if (year === startYear) {
      startMonthOfYear = startMonth;
    }

    if (year === endYear) {
      endMonthOfYear = endMonth;
    }

    for (let month = startMonthOfYear; month <= endMonthOfYear; month += 3) {
      const paddedYear = year.toString();
      const paddedMonth = month.toString().padStart(2, '0');
      const tableName = `${preName}${paddedYear}${paddedMonth}`;
      tableNames.push(tableName);
    }
  }

  return tableNames;
};

/**
 * 取得 table 年＋月
 * @param year
 * @param month
 * @returns
 */
export const getLogTableMonth = (year: string, month: number) => {
  if (month >= 1 && month <= 3) {
    return `${year}01`;
  } else if (month >= 4 && month <= 6) {
    return `${year}04`;
  } else if (month >= 7 && month <= 9) {
    return `${year}07`;
  } else if (month >= 10 && month <= 12) {
    return `${year}10`;
  }
};

/**
 * 陣列去重複
 *
 * @param arr
 * @returns
 */
export const removeDuplicates = (arr: string[]) => {
  return [...new Set(arr)];
};

/**
 * 計算距離今天結束還有多少秒
 * @returns
 */
export const secondsUntilEndOfDay = () => {
  // 取得今天的結束時間
  const endOfDay: Date = new Date();
  endOfDay.setHours(23, 59, 59, 999); // 將時間設定為當天的最後一刻

  return Math.floor((endOfDay.getTime() - new Date().getTime()) / 1000);
};

/**
 * 創建檔案密碼，英文大小寫+~!@#$%^&* 等符號組成，共12碼密碼
 *
 * @returns
 */
export const generatePassword = () => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+~!@#$%^&*';
  const charactersLength = characters?.length;

  let password = '';
  for (let i = 0; i < 12; i++) {
    password += characters[Math.floor(Math.random() * charactersLength)];
  }

  return password;
};
