import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import { CHECK_LOGIN } from 'config/config';
import homePageType from 'constants/homePageType';

function RedirectUrl() {
  const location = useLocation();
  const navigate = useNavigate();
  const checkLogin = CHECK_LOGIN;
  // 檢查使用者登入狀態，未登入則導向login
  useEffect(() => {
    const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
    if (checkLogin) {
      if (!userInfo && location.pathname !== '/login') {
        navigate('/');
      } else {
        // 根據使用者權限 跳轉頁面
        if (userInfo.homePage) {
          navigate(homePageType[userInfo.homePage]);
        } else {
          navigate('/');
        }
      }
    }
  }, [checkLogin, location, navigate]);

  return <div></div>;
}

export default RedirectUrl;
