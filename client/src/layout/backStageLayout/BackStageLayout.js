import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { routerConfig } from 'routes/router';
import routerPath from 'routes/router.path';

import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import Avatar from 'components/avatar/Avatar';
import IconButton from 'components/button/iconButton/IconButton';
import Nav from 'components/nav/Nav';
import ToolTip from 'components/tooltip/ToolTip';

import { Stack } from 'react-bootstrap';
import DefaultOutlet from './sub_defaultLayout/DefaultOutlet';
import DefaultFooter from './sub_defaultLayout/DefaultFooter';
import { MenuIcon } from 'assets/icons';
// import logo from 'assets/images/logo.svg';
import './backStageLayoutStyle.scss';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import { CHECK_LOGIN, SIDE_MENU_IS_OPEN } from 'config/config';

/* 基本樣式： 側邊欄 + 上部使用者導覽 + 名稱 */
function BackStageLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const checkLogin = CHECK_LOGIN;

  // 優先使用網址帶的 title
  const urlTitle = useMemo(
    () => new URLSearchParams(location.search).get('title'),
    [location.search]
  );

  // 有人直闖後台時，檢查使用者登入狀態，未登入則導向login
  useEffect(() => {
    // if (checkLogin) {
    //   const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
    //   if (!userInfo && location.pathname !== '/login') {
    //     navigate('/secretDoor/login');
    //   }
    // }
  }, [checkLogin, location, navigate]);

  // 遞迴獲取最深層次且最匹配當前路徑的路由配置 反向遍歷
  const getMatchedRoute = (routes, pathname, prefix = '') => {
    for (let i = routes.length - 1; i >= 0; i--) {
      const route = routes[i];
      const path = `/${prefix}/${route.path}`.replace('//', '/');
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
    routerConfig[1].children,
    location.pathname,
    routerPath.secretDoor
  );
  return (
    <div id='backstage_layout' className='container-fluid d-flex g-0'>
      {/* Side Menu */}
      <SideMenu />
      <div className='backstage_main_section'>
        {/* Header */}
        <div className='backstage_header'>
          <Breadcrumb />
          <Stack direction='horizontal'>
            <Avatar isDropDown />
          </Stack>
        </div>
        {/* Title */}
        <div className='backstage_title'>
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
    <div className={`side_menu side_menu_${classSuffix}`}>
      <div className={`side_menu_top side_menu_top_${classSuffix}`}>
        {isOpen && (
          <>
            {/* <img src={logo} alt='logo' /> */}
            <h6 className='text-white mb-0 fw-bold'>後台管理</h6>
          </>
        )}
        <div className={`icon_button_right_${classSuffix} `}>
          <IconButton hoverBackground='transparent' onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
        </div>
      </div>
      <Nav isOpen={isOpen} />
    </div>
  );
}

BackStageLayout.Footer = DefaultFooter;
BackStageLayout.Outlet = DefaultOutlet;

export default BackStageLayout;
