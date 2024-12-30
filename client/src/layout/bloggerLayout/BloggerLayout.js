import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { routerConfig } from 'routes/router';
import routerPath from 'routes/router.path';
import api from 'services/api';

import Navbars from 'components/navbars/Navbars';
// import Avatar from 'components/avatar/Avatar';
// import Breadcrumb from 'components/breadcrumb/Breadcrumb';
// import IconButton from 'components/button/iconButton/IconButton';
// import Nav from 'components/nav/Nav';
// import ToolTip from 'components/tooltip/ToolTip';

import { Container, Row, Col } from 'react-bootstrap';
import './bloggerLayoutStyle.scss';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'layout/BloggerLayout.js',
  _NOTICE: ''
});

/* 基本樣式： 側邊欄 + 上部使用者導覽 + 名稱 */
function BloggerLayout({ children, bannerHeight }) {
  const location = useLocation();
  // const navigate = useNavigate();

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
    routerConfig[0].children,
    location.pathname
  );
  // console.log('currentRoute', currentRoute, currentRoute?.path?.length);
  return (
    <div id='blogger_layout'>
      {/* Side Menu */}
      <div className='blogger_layout_side_menu'>
        <Navbars
          brand='Gorgeous Wade'
          sideNavTitle='Gorgeous Wade'
          subPath={[
            {
              path: routerPath.posts,
              title: '文章',
              icon: ''
            },
            // {
            //   path: routerPath.timeline,
            //   title: '時間軸',
            //   icon: ''
            // },
            // {
            //   path: routerPath.categories,
            //   title: '分類',
            //   icon: ''
            // },
            {
              path: routerPath.about,
              title: '關於我',
              icon: ''
            }
          ]}
        />
      </div>
      <div
        className='blogger_layout_banner'
        style={{
          height: currentRoute?.path?.length > 1 ? '50vh' : `${bannerHeight}vh`,
          backgroundImage: `url(https://storage.cloud.google.com/personal_public/blog/iceland.webp)`
        }}
      >
        <div className='blogger_layout_banner_intro'>
          <h1>{currentRoute?.path?.length > 1 ? '' : `I'm Wade Wu`}</h1>
        </div>
      </div>
      {/* Main content */}
      <Container className='container'>
        <Row className='blogger_layout_main'>
          {/* Aside Card */}
          {currentRoute?.hiddenAsideCard ? null : (
            <Col
              sm={0}
              md={3}
              className='blogger_layout_aside d-none d-md-block'
            >
              <BloggerLayoutAsideCard />
            </Col>
          )}
          {/* Content */}
          <Col
            sm='auto'
            md={currentRoute?.hiddenAsideCard ? 12 : 9}
            className='blogger_layout_content'
          >
            <Outlet>{children}</Outlet>
          </Col>
        </Row>
      </Container>
      <BloggerLayoutFooter />
    </div>
  );
}

/** 側邊資訊小卡 */
function BloggerLayoutAsideCard() {
  const [postCount, setPostCount] = useState(null);
  const [categoriesCount, setCategoriesCount] = useState(null);

  /** 取得側邊欄小卡資訊 */
  const getAsideCardDetail = useCallback(async () => {
    try {
      const res = await api.common.getAsideCardDetail();
      const apiRes = res;
      if (apiRes) {
        // const res = new GetPostByIdClass(apiRes);
        return res;
      }
    } catch (error) {
      _EHS.errorReport(error, 'getAsideCardDetail', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      const asideCardInfo = await getAsideCardDetail();
      const postCount = asideCardInfo?.postCount;
      const categoriesCount = asideCardInfo?.categoriesCount;
      setPostCount(postCount);
      setCategoriesCount(categoriesCount);
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, [getAsideCardDetail]);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);
  return (
    <div className='blogger_layout_aside_card'>
      <section className='blogger_layout_aside_card_avatar'>
        <img
          alt='Spanner Wade'
          src='https://storage.cloud.google.com/personal_public/blog/post_images/common/avatar.jpg'
        ></img>
      </section>
      <section className='blogger_layout_aside_card_name'>
        <h2>Wade Wu</h2>
        <p>Gorgeous Wade</p>
      </section>
      <section className='blogger_layout_aside_card_counts'>
        <div>
          <p>文章</p>
          <p>{postCount}</p>
        </div>
        <div>
          <p>分類</p>
          <p>{categoriesCount}</p>
        </div>
      </section>
      <section className='blogger_layout_aside_card_social'></section>
    </div>
  );
}

/** Footer */
function BloggerLayoutFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='blogger_layout_footer'>
      <p>© {currentYear} By Wade Wu</p>
      <p>Theme From HEXO Butterfly</p>
    </footer>
  );
}

export default BloggerLayout;
