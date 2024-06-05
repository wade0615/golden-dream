import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import { FUNCTION_CHECK_AUTH } from 'config/config';

/**
 * Description 檢查使用者功能權限
 * @param {String} authCode -權限代碼
 * @param {JSX} children
 */

const checkLogin = FUNCTION_CHECK_AUTH;

function PermissionAction({ authCode, children }) {
  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  const checkAuth = !!userInfo && checkLogin;

  // 如果 children 不存在或權限檢查未開啟，直接返回原始子元件
  if (!children || !checkAuth) return children;

  // const hasPermission =
  //   Array.isArray(userInfo.authItems) && userInfo.authItems.includes(authCode);

  let hasPermission = false;

  // 檢查使用者是否有所需的權限
  if (Array.isArray(userInfo.authItems)) {
    if (Array.isArray(authCode)) {
      // authCode 是一個陣列，檢查使用者是否具有陣列中的任何一個權限
      hasPermission = authCode.some((code) =>
        userInfo.authItems.includes(code)
      );
    } else {
      // authCode 是一個單一字串，檢查使用者是否有這個權限
      hasPermission = userInfo.authItems.includes(authCode);
    }
  }

  // 如果無權限，則不渲染子元件
  if (authCode && !hasPermission) {
    return null;
  }

  return children;
}

export default PermissionAction;
