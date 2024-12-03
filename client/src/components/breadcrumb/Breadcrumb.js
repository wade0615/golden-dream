import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb as BBreadcrumb } from 'react-bootstrap';
import { MdHome } from 'react-icons/md';

import { routerConfig } from 'routes/router';

import './breadcrumbStyle.scss';

// 遞迴獲取所有麵包屑路由配置 反向遍歷
const getBreadcrumbItems = (routes, pathname, prefix = '') => {
  for (let i = routes.length - 1; i >= 0; i--) {
    const route = routes[i];
    const path = `${prefix}/${route.path}`.replace('//', '/');
    if (pathname.startsWith(path)) {
      if (route.children) {
        const breadcrumbItems = getBreadcrumbItems(
          route.children,
          pathname,
          path
        );
        if (breadcrumbItems.length > 0) {
          return [route, ...breadcrumbItems];
        }
      }
      if (!route.hiddenFromBreadcrumb) {
        return [route];
      }
    }
  }
  return [];
};

function Breadcrumb() {
  const location = useLocation();

  // 優先使用網址帶的 title
  const urlTitle = useMemo(
    () => new URLSearchParams(location.search).get('title'),
    [location.search]
  );

  // 獲取所有麵包屑路由配置
  const breadcrumbItems = getBreadcrumbItems(
    routerConfig[1].children,
    location.pathname
  );
  const items = [];
  items.push(
    <BBreadcrumb.Item href='#' active className='item' key='home'>
      <MdHome color='text-secondary' size='18px' />
      {breadcrumbItems.length !== 1 ? (
        <Link to={''} className='link-no-style'>
          首頁
        </Link>
      ) : (
        <span style={{ color: 'black' }}>首頁</span>
      )}
    </BBreadcrumb.Item>
  );
  let realLastIndex = breadcrumbItems.length - 1;
  for (let index = breadcrumbItems.length - 1; index >= 0; index--) {
    const route = breadcrumbItems[index];
    if (route.breadcrumbParentTitle) {
      realLastIndex = index;
      break;
    }
  }
  for (let index = 0; index < breadcrumbItems.length; index++) {
    const route = breadcrumbItems[index];
    const isLast = index === realLastIndex;
    if (route.breadcrumbParentTitle && isLast) {
      items.push(
        <BBreadcrumb.Item
          href='#'
          active
          className='item'
          key={`breadcrumbParent-${index}`}
        >
          <Link to={route.breadcrumbParentPath} className='link-no-style'>
            {route.breadcrumbParentTitle}
          </Link>
        </BBreadcrumb.Item>
      );
    }
    const itemClass = isLast ? 'item item-last' : 'item';
    if (route.breadcrumbPath !== '') {
      items.push(
        <BBreadcrumb.Item
          href='#'
          active
          className={itemClass}
          key={`current-${index}`}
        >
          {route.breadcrumbPath ? (
            <Link to={route.breadcrumbPath} className='link-no-style'>
              {route.pageTitle}
            </Link>
          ) : urlTitle ? (
            urlTitle
          ) : (
            route.pageTitle
          )}
        </BBreadcrumb.Item>
      );
    }
  }

  return <BBreadcrumb>{items}</BBreadcrumb>;
  // return (
  //   <BBreadcrumb>
  //     <BBreadcrumb.Item href='#' active className='item'>
  //       <MdHome color='text-secondary' size='18px' />
  //       首頁
  //     </BBreadcrumb.Item>
  //     <BBreadcrumb.Item href='#' active className='item'>
  //       會員管理
  //     </BBreadcrumb.Item>
  //     <BBreadcrumb.Item href='#' active className='item'>
  //       會員資料
  //     </BBreadcrumb.Item>
  //   </BBreadcrumb>
  // );
}

export default Breadcrumb;
