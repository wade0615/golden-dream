import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { routerConfig } from 'routes/router';

import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import Avatar from 'components/avatar/Avatar';
import IconButton from 'components/button/iconButton/IconButton';
import Nav from 'components/nav/Nav';
import ToolTip from 'components/tooltip/ToolTip';

import { Stack } from 'react-bootstrap';
import DefaultOutlet from './sub_defaultLayout/DefaultOutlet';
import DefaultFooter from './sub_defaultLayout/DefaultFooter';
import { MenuIcon } from 'assets/icons';
import logo from 'assets/images/logo.svg';
import './defaultLayoutStyle.scss';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import { CHECK_LOGIN, SIDE_MENU_IS_OPEN } from 'config/config';

/* 基本樣式： 側邊欄 + 上部使用者導覽 + 名稱 */
function DefaultLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const checkLogin = CHECK_LOGIN;

  // 優先使用網址帶的 title
  const urlTitle = useMemo(
    () => new URLSearchParams(location.search).get('title'),
    [location.search]
  );

  // 檢查使用者登入狀態，未登入則導向login
  useEffect(() => {
    if (checkLogin) {
      const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
      if (!userInfo && location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [checkLogin, location, navigate]);

  // 遞迴獲取最深層次且最匹配當前路徑的路由配置 反向遍歷
  const getMatchedRoute = (routes, pathname, prefix = '') => {
    for (let i = routes.length - 1; i >= 0; i--) {
      const route = routes[i];
      const path = `${prefix}/${route.path}`.replace('//', '/');
      if (pathname.startsWith(path)) {
        if (route.children) {
          const matchedRoute = getMatchedRoute(route.children, pathname, path);
          if (matchedRoute) {
            return matchedRoute;
          }
        }
        return route;
      }
    }
    return null;
  };
  let currentRoute = getMatchedRoute(
    routerConfig[2].children,
    location.pathname
  );
  return (
    <div className='container-fluid d-flex g-0'>
      {/* Side Menu */}
      <SideMenu />
      <div className='main-section'>
        {/* Header */}
        <div className='default-header'>
          <Breadcrumb />
          <Stack direction='horizontal'>
            <Avatar isDropDown />
          </Stack>
        </div>
        {/* Title */}
        <div className='default-title'>
          <h5>{urlTitle ? urlTitle : currentRoute?.pageTitle}</h5>
          {!!currentRoute?.tooltip && (
            <ToolTip placement='bottom'>{currentRoute?.tooltip}</ToolTip>
          )}
        </div>

        {/* Content */}
        <Outlet>{children}</Outlet>
      </div>
    </div>
  );
}

function SideMenu() {
  // 從 localStorage 中獲取狀態或使用預設值
  const savedMenuState =
    localStorageUtil.getItem(LocalStorageKeys.SetSideMenu) || {};
  const initialIsOpen =
    savedMenuState.sideMenu !== undefined
      ? savedMenuState.sideMenu
      : SIDE_MENU_IS_OPEN;
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(!isOpen); // 切換狀態
    // 將新的狀態存儲到 localStorage
    localStorageUtil.setItem(LocalStorageKeys.SetSideMenu, {
      ...savedMenuState,
      sideMenu: newIsOpen
    });
  };
  const classSuffix = isOpen ? 'open' : 'closed';
  return (
    <div className={`side-menu side-menu-${classSuffix}`}>
      <div className={`side-menu__top side-menu__top-${classSuffix}`}>
        {isOpen && (
          <>
            <img src={logo} alt='logo' />
            <h6 className='text-white mb-0 fw-bold'>CRM管理系統</h6>
          </>
        )}
        <div className={`icon-button-right-${classSuffix} `}>
          <IconButton hoverBackground='transparent' onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
        </div>
      </div>
      <Nav isOpen={isOpen} />
    </div>
  );
}

DefaultLayout.Footer = DefaultFooter;
DefaultLayout.Outlet = DefaultOutlet;

export default DefaultLayout;
