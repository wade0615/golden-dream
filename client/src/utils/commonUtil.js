import Swal from 'sweetalert2';
import ExceptionHandleService from 'utils/exceptionHandler';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import routerPath from 'routes/router.path';

const _EHS = new ExceptionHandleService({
  _NAME: 'commonUtil',
  _NOTICE: ''
});

export const isEmptyObject = (obj) => {
  return Object.entries(obj).length === 0;
};

/* 整理 cityCode / zipCode 下拉式選項 */
export const formatAddressOptions = (data) => {
  const formatCityCode = data.map((code) => {
    return {
      value: code.cityCode,
      label: code.cityName
    };
  });

  const formatZipCode = data.reduce((acc, cur) => {
    let zips = cur.zips.map((code) => {
      return {
        value: code.zipCode,
        label: code.zipName
      };
    });
    return { ...acc, [cur.cityCode]: zips };
  }, {});
  return [formatCityCode, formatZipCode];
};

/** 姓名第2、4、6...個字元遮蔽 */
export const maskName = (name) => {
  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  // 如果是管理員，直接返回姓名
  if (userInfo.isAdmin) {
    return name;
  }
  // 如果 name 是 '--'，直接返回原值
  if (name === '--') {
    return name;
  }
  // 否則，進行遮蔽處理
  return name
    .split('')
    .map((char, index) => {
      return (index + 1) % 2 === 0 ? '*' : char;
    })
    .join('');
};

/** 手機號碼中間3個數字遮蔽 */
export const maskMobile = (mobile) => {
  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  // 如果是管理員，直接返回手機號碼
  if (userInfo.isAdmin) {
    return mobile;
  }
  const len = mobile.length;
  const middleIndex = Math.floor(len / 2);
  // 根據不同的長度進行遮蔽處理
  if (len < 3) {
    return mobile;
  } else if (len === 3 || len === 4) {
    return (
      mobile.substring(0, middleIndex - 1) +
      '*' +
      mobile.substring(middleIndex + 1)
    );
  } else if (len === 5) {
    return (
      mobile.substring(0, middleIndex - 1) +
      '***' +
      mobile.substring(middleIndex + 2)
    );
  } else if (len % 2 === 0) {
    return (
      mobile.substring(0, middleIndex - 1) +
      '**' +
      '*' +
      mobile.substring(middleIndex + 2)
    );
  } else {
    return (
      mobile.substring(0, middleIndex - 1) +
      '***' +
      mobile.substring(middleIndex + 2)
    );
  }
};

/* 數字插入逗點 */
export const insertComma = (value) => {
  if (typeof value === 'undefined' || value === '' || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'number') {
    value = +value;
  }

  return value.toLocaleString();
};

/** 取得圖片尺寸 */
export const getImageSize = (file) =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (img) => {
      const image = new Image();
      image.src = img.target.result; // 讀取圖片
      image.onload = () => {
        res({ height: image.height, width: image.width });
      };
    };
  });

export const validateImage = async ({
  files,
  maxHeight = 640,
  maxWidth = 640,
  maxMb = 1
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

  async function check(f) {
    const maxByte = (maxMb ?? 0) * 1024 * 1024;
    //檢核檔案大小
    if (maxByte && f.size > maxByte) {
      Swal.fire({
        icon: 'info',
        title: '上傳失敗',
        text: `圖檔超過限制 ${maxMb} MB，請重新上傳。`
      });
      return false;
    }
    //檢核圖片尺寸
    const imgSize = await getImageSize(f);
    if (
      (maxHeight && imgSize.height > maxHeight) ||
      (maxWidth && imgSize.width > maxWidth)
    ) {
      Swal.fire({
        icon: 'info',
        title: '上傳失敗',
        text: ` 圖檔尺寸為 ${maxWidth}*${maxHeight}，請重新上傳。`
      });
      return false;
    }

    return true;
  }
};

export const validateFile = async ({ files, maxMb = 1 }) => {
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

  async function check(f) {
    const maxByte = (maxMb ?? 0) * 1024 * 1024;
    //檢核檔案大小
    if (maxByte && f.size > maxByte) {
      Swal.fire({
        icon: 'info',
        title: '上傳失敗',
        text: `圖檔超過限制 ${maxMb} MB，請重新上傳。`
      });
      return false;
    }

    return true;
  }
};

/** 驗證 editor 內容長度 (長度不包含 html Tag) */
export const validateEditorContentTextLength = (
  editorRef,
  maxLength,
  minLength = null
) => {
  try {
    if (!editorRef) return false;

    const body = editorRef?.current?.editor?.getBody();
    const numChars = body?.textContent?.length ?? 0;

    const isMaxValid = (maxLength === 0 || maxLength) && maxLength >= numChars;
    const isMinValid =
      ((minLength === 0 || minLength) && minLength <= numChars) || !minLength;

    return isMaxValid && isMinValid;
  } catch (error) {
    _EHS.errorReport(
      error,
      'validateEditorContentTextLength',
      _EHS._LEVEL.ERROR
    );
    return false;
  }
};

// 驗證是否有登入過，從沒登入過，直接請你離開
export const varifyLoginToken = () => {
  try {
    const token = localStorageUtil.getItem(
      LocalStorageKeys.UserInfo
    )?.accessToken;
    if (!token) {
      window.location.href = `/${routerPath.login}`;
    }
  } catch (error) {
    _EHS.errorReport(error, 'varifyLoginToken', _EHS._LEVEL.ERROR);
    return false;
  }
};
