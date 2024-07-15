import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { routerConfig } from 'routes/router';

import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import Avatar from 'components/avatar/Avatar';
import IconButton from 'components/button/iconButton/IconButton';
import Nav from 'components/nav/Nav';
import Navbars from 'components/navbars/Navbars';
import ToolTip from 'components/tooltip/ToolTip';

import { Container, Row, Col } from 'react-bootstrap';
import { MenuIcon } from 'assets/icons';
import logo from 'assets/images/logo.svg';
import './bloggerLayoutStyle.scss';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import { CHECK_LOGIN, SIDE_MENU_IS_OPEN } from 'config/config';

/* 基本樣式： 側邊欄 + 上部使用者導覽 + 名稱 */
function BloggerLayout({ children, bannerHeight }) {
  const location = useLocation();
  const navigate = useNavigate();
  const checkLogin = CHECK_LOGIN;

  // 優先使用網址帶的 title
  const urlTitle = useMemo(
    () => new URLSearchParams(location.search).get('title'),
    [location.search]
  );

  // 檢查使用者登入狀態，未登入則導向login
  // useEffect(() => {
  //   if (checkLogin) {
  //     const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  //     if (!userInfo && location.pathname !== '/login') {
  //       navigate('/login');
  //     }
  //   }
  // }, [checkLogin, location, navigate]);

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
  console.log('currentRoute', currentRoute);
  return (
    <div id='blogger_layout'>
      {/* Side Menu */}
      <div className='blogger_layout_side_menu'>
        <Navbars
          brand='W.S.Wade'
          sideNavTitle='W.S.Wade'
          subPath={[
            {
              path: '/',
              title: '首頁',
              icon: ''
            },
            {
              path: '/',
              title: '列表',
              icon: ''
            },
            {
              path: '/',
              title: '分類',
              icon: ''
            },
            {
              path: '/',
              title: '關於我',
              icon: ''
            }
          ]}
        />
      </div>
      <div
        className='blogger_layout_banner'
        style={{ height: `${bannerHeight}vh` }}
      >
        這邊放 Banner 圖片，首頁會特別大
      </div>
      {/* Main content */}
      <Container className='container'>
        <Row className='blogger_layout_main'>
          {/* Aside Card */}
          <Col
            sm={0}
            md={3}
            className='blogger_layout_aside_card d-none d-md-block'
          >
            這邊放人物框，手機版會消失， PC 版會顯示
          </Col>
          {/* Content */}
          <Col sm='auto' md={9} className='blogger_layout_content'>
            <Outlet>{children}</Outlet>
          </Col>
        </Row>
      </Container>
      <BloggerLayoutFooter />
    </div>
  );
}

function BloggerLayoutSideMenu() {
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

function BloggerLayoutFooter() {
  return (
    <div className='blogger_layout_footer'>
      <p>© 2024 By Wade Wu</p>
      <p>Theme From HEXO Butterfly</p>
    </div>
  );
}

export default BloggerLayout;
