import Swal from 'sweetalert2';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';
import fetchJson from './fetch';
// import { CHECK_LOGIN } from 'config/config';

let isRefreshing = false;
const failedQueue = [];
// const checkLogin = CHECK_LOGIN;

// 處理 api response
const apiResponseHandler = async (
  res,
  type = 'json',
  originalUrl,
  originalOptions
) => {
  try {
    if (type === 'json') {
      const response = await res.json();
      let msg = '';
      if (res?.ok) {
        switch (response?.statusCode) {
          case 1000: // 1000 為正常，其餘為自訂錯誤處理
          case 220005: //查無此會員
          case 220007: //批量錯誤訊息
          case 360005: // 通知設定 資料重複
          case 360006: // 通知設定 通知分類不存在
          case 360007: // 通知設定 Excel 資料不存在
          case 320025: // ----核銷錯誤代碼開始----
          case 320026:
          case 320027:
          case 320028:
          case 320029:
          case 320030:
          case 320031:
          case 320032:
          case 320033:
          case 320034:
          case 320035:
          case 320036:
            // ---核銷錯誤代碼結束----
            return response.result;
          //   case 200001: //系統錯誤
          //   case 200002: //系統錯誤
          case 400001: // -- 分群相關錯誤代碼 START --
          case 400002:
          case 400003:
          case 400004:
          case 400005:
          case 400006:
          case 410001:
          case 410002:
          case 410003:
          case 410004:
          case 410005:
          case 410006:
          case 410007:
          case 410008:
          case 410009:
          case 410010:
          case 410011:
          case 420001: // -- 分群相關錯誤代碼 END --
            msg = response?.result?.msg || response.result?.message;
            errorFire(msg, response?.statusCode);
            return false;
          default:
            msg = response?.result?.msg || response.result?.message;
            errorFire(msg, response?.statusCode);
            return null;
          // throw Error(msg);
        }
      } else if (res?.status === 403) {
        switch (response?.statusCode) {
          case 200008: //登入逾時，請重新登入 accessToken & refreshToken 過期
            msg = response?.result?.msg || response.result?.message;
            errorFire(msg, response?.statusCode).then((res) => {
              // 無權限導至 login 頁面
              localStorageUtil.removeItem(LocalStorageKeys.UserInfo);
              window.location.href = '/login';
            });
            return;
          case 200009: //登入逾時，請重新登入 accessToken 過期
            return await handleTokenTimeOut(
              response,
              originalUrl,
              originalOptions
            );
          default:
            errorFire(response?.result?.msg, response?.statusCode);
        }
      } else {
        // 200~299 以外 https status code
        errorFire(response?.result?.msg, response?.statusCode);
        // errorFire(
        //   `抱歉，系統出現技術問題，我們正在積極著手解決。請幾分鐘後再試一次或請洽系統管理員(${response?.statusCode ?? ''})。`
        // );
      }
    } else if (type === 'blob') {
      const response = await res.blob();
      console.log(response);
      return response;
    } else {
      return res;
    }
  } catch (error) {
    errorFire(error);
    return null;
  }
};

// sweetAlert fire
function errorFire(msg, statusCode) {

  console.log('=== errorFire msg', msg);

  // if (checkLogin) {
  //   const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  //   if (!userInfo) {
  //     return; // 如果用戶未登入，則不顯示彈窗
  //   }
  // }
  const showMsg = true; // 錯誤訊息顯示開關
  return Swal.fire({
    icon: 'error',
    // title: 'Oops...',
    // text: msg
    html: !statusCode
      ? showMsg
        ? msg
        : '網路不穩，請重新再試'
      : showMsg
        ? `${msg}<br>(${statusCode})`
        : `網路不穩，請重新再試<br>(${statusCode})`
  });
}

const processQueue = (error = null, token = null) => {
  failedQueue.forEach((queueItem) => {
    if (error) {
      queueItem.reject(error);
    } else if (token) {
      fetchJson(queueItem.originalUrl, queueItem.originalOptions)
        .then(queueItem.resolve)
        .catch(queueItem.reject);
    } else {
      // 直接解析等待的請求
      queueItem.resolve();
    }
  });
  // 清空 failedQueue 陣列
  failedQueue.length = 0;
};

/** Token過期 */
async function handleTokenTimeOut(res, originalUrl, originalOptions) {
  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  // 清除 accessToken
  localStorageUtil.setItem(LocalStorageKeys.UserInfo, {
    ...userInfo,
    accessToken: ''
  });
  // 對應同時多個 api 時的處理，第一個 api 觸發 isRefreshing = true 後，其餘的會藉由 Promise 記錄到 failedQueue，最後用 processQueue 重新發送 api
  if (!isRefreshing) {
    isRefreshing = true;
    const resData = await api.auth.refresh();
    isRefreshing = false;
    if (resData && resData?.accessToken && resData?.refreshToken) {
      localStorageUtil.setItem(LocalStorageKeys.UserInfo, {
        ...userInfo,
        accessToken: resData?.accessToken,
        refreshToken: resData?.refreshToken
      });
      // 將當前請求也放入 failedQueue 中
      failedQueue.push({
        originalUrl,
        originalOptions,
        resolve: (response) => response,
        reject: (error) => {
          throw error;
        }
      });
      processQueue(null, resData?.accessToken);
      //拿到新的 accessToken 接著要重新發送 原先失敗的 api
      return fetchJson(originalUrl, originalOptions);
    } else {
      processQueue(); // 確保即使刷新失敗也要處理 failedQueue。
      // 導至 login 頁面
      const msg = res?.result?.msg || res.result?.message;
      errorFire(msg, res?.statusCode).then((res) => {
        // 無權限導至 login 頁面
        localStorageUtil.removeItem(LocalStorageKeys.UserInfo);
        window.location.href = '/login';
      });
    }
  } else {
    // 返回一個新的 Promise，這樣當 token 刷新完成後，可以解析或拒絕這個 Promise
    return new Promise((resolve, reject) => {
      failedQueue.push({
        originalUrl,
        originalOptions,
        resolve,
        reject
      });
    });
  }
}

export default apiResponseHandler;
