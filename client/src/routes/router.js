import { createBrowserRouter, Navigate } from 'react-router-dom';

import { RedisGui } from 'pages/redis';
import { Login } from 'pages/login';
import { PostList, PostPage } from 'pages/posts';
import { Categories } from 'pages/categories';
import { About } from 'pages/about';
import { Timeline } from 'pages/timeline';

import {
  MemberList,
  AddMember,
  MemberInfo,
  SpecialTypeMember,
  BatchMembers,
  MemberInfoDownload
} from 'pages/member';
import { Error404 } from 'pages/errors';
import { RedirectUrl } from 'pages/redirectUrl';

import { BloggerLayout } from 'layout';
import { PersonOutlineIcon } from 'assets/icons';

import AUTH_CODE from 'config/auth.code.config';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import NonAccess from './other/NonAccess';
import { PAGE_CHECK_AUTH } from 'config/config';

import routerPath from 'routes/router.path';

function HasAuth({ routeConfig, originalElement }) {
  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  const checkAuth = !!userInfo && PAGE_CHECK_AUTH;
  const hasPermission =
    userInfo &&
    Array.isArray(userInfo.authItems) &&
    userInfo.authItems.includes(routeConfig.authCode);
  if (checkAuth && routeConfig.authCode && !hasPermission) {
    return <NonAccess />;
  }
  return originalElement; // 使用傳遞的原始元件
}

function applyHasAuth(route) {
  if (route.authCode && route.element) {
    const originalElement = route.element; // 保存原始元件
    route.element = (
      <HasAuth routeConfig={route} originalElement={originalElement} />
    ); // 傳遞原始元件
  }
  if (route.children) {
    route.children.forEach(applyHasAuth);
  }
}

export const routerConfig = [
  {
    path: '/login', // 路由的路徑
    element: <Login /> // 當訪問 '/login' 路由時要渲染的元件
  },
  {
    path: '/redis-gui', // 路由的路徑
    element: <RedisGui /> // 當訪問 '/redis-gui' 路由時要渲染的元件
  },
  {
    path: '/', // 路由的路徑
    element: <BloggerLayout bannerHeight='80' />, // 訪問時要渲染的元件
    errorElement: <Error404 />, // 有任何錯誤，例如無效的路由，就會渲染這個元件
    children: [
      // 子路由的陣列，它們會在訪問此路由時進一步導航
      /**
       ** 首頁
       **/
      {
        index: true, // 表示當路徑為 '/' 時，這個路由會被使用
        path: routerPath.home, // 子路由的路徑
        breadcrumbPath: '', // 頁面路由，用於麵包屑
        // element: <Home />,
        element: <PostList />,
        pageTitle: '首頁', // 可以添加首頁的標題
        tooltip: <p>首頁喔</p>
      },
      /**
       ** posts 文章首頁列表
       **/
      {
        path: routerPath.posts, // 子路由的路徑
        breadcrumbPath: routerPath.posts, // 頁面路由，用於麵包屑
        // element: <PostList />, // 當訪問 '/posts' 路由時要渲染的元件
        errorElement: <Error404 />, // 有任何錯誤，例如無效的子路由，就會渲染這個元件
        sidebarIcon: <PersonOutlineIcon color='white' size='24' />, // 手機版側邊欄中對應此路由的圖標
        pageTitle: '文章列表', // 此路由的頁面標題
        shortTitle: '文章列表', // 此路由的短標題
        authCode: '', // 權限代碼
        children: [
          // 子路由的子路由的陣列
          {
            index: true, // 預設路由，當訪問 '/member' 時，會自動導航到此路由
            element: <Navigate to='list' />, // 自動導航到 'list' 子路由
            hiddenFromNav: true // 導航欄中是否隱藏
          },
          {
            path: routerPath.postList,
            pageTitle: '文章列表',
            element: <PostList />,
            authCode: '',
            subPath: [routerPath.postPage] // 子路由的陣列
          },
          {
            path: routerPath.postPage,
            pageTitle: '文章頁',
            element: <PostPage />,
            authCode: '',
            hiddenFromNav: true,
            breadcrumbParentPath: routerPath.postList, // 前一層的頁面路由，用於麵包屑
            breadcrumbParentTitle: '文章列表' // 前一層的頁面標題，用於麵包屑
          }
        ]
      },
      /**
       ** timeline 文章時間列表
       **/
      {
        path: routerPath.timeline, // 子路由的路徑
        breadcrumbPath: routerPath.timeline, // 頁面路由，用於麵包屑
        element: <Timeline />, // 當訪問 '/timeline' 路由時要渲染的元件
        errorElement: <Error404 />, // 有任何錯誤，例如無效的子路由，就會渲染這個元件
        sidebarIcon: <PersonOutlineIcon color='white' size='24' />, // 手機版側邊欄中對應此路由的圖標
        pageTitle: '時間軸', // 此路由的頁面標題
        shortTitle: '時間軸', // 此路由的短標題
        authCode: '' // 權限代碼
      },
      /**
       ** categories 文章分類
       **/
      {
        path: routerPath.categories, // 子路由的路徑
        breadcrumbPath: routerPath.categories, // 頁面路由，用於麵包屑
        element: <Categories />, // 當訪問 '/categories' 路由時要渲染的元件
        errorElement: <Error404 />, // 有任何錯誤，例如無效的子路由，就會渲染這個元件
        sidebarIcon: <PersonOutlineIcon color='white' size='24' />, // 手機版側邊欄中對應此路由的圖標
        pageTitle: '文章分類', // 此路由的頁面標題
        shortTitle: '分類', // 此路由的短標題
        authCode: '' // 權限代碼
      },
      /**
       ** about 關於我
       **/
      {
        path: routerPath.about, // 子路由的路徑
        breadcrumbPath: routerPath.about, // 頁面路由，用於麵包屑
        element: <About />, // 當訪問 '/about' 路由時要渲染的元件
        errorElement: <Error404 />, // 有任何錯誤，例如無效的子路由，就會渲染這個元件
        sidebarIcon: <PersonOutlineIcon color='white' size='24' />, // 手機版側邊欄中對應此路由的圖標
        pageTitle: '關於我', // 此路由的頁面標題
        shortTitle: '關於我', // 此路由的短標題
        authCode: '' // 權限代碼
      },
      /**
       ** 會員管理
       **/
      {
        path: 'member', // 子路由的路徑
        breadcrumbPath: 'member', // 頁面路由，用於麵包屑
        errorElement: <Error404 />, // 有任何錯誤，例如無效的子路由，就會渲染這個元件
        sidebarIcon: <PersonOutlineIcon color='white' size='24' />, // 側邊欄中對應此路由的圖標
        pageTitle: '會員管理', // 此路由的頁面標題
        shortTitle: '會員', // 此路由的短標題
        authCode: AUTH_CODE.MEMBER.MODULE, // 權限代碼
        children: [
          // 子路由的子路由的陣列
          {
            index: true, // 預設路由，當訪問 '/member' 時，會自動導航到此路由
            element: <Navigate to='list' />, // 自動導航到 'list' 子路由
            hiddenFromNav: true // 導航欄中是否隱藏
          },
          {
            path: 'list',
            pageTitle: '會員資料',
            element: <MemberList />,
            authCode: AUTH_CODE.MEMBER.INFO.PAGE,
            subPath: ['list/add', 'list/info'] // 子路由的陣列
          },
          {
            path: 'list/add',
            pageTitle: '新增會員',
            element: <AddMember />,
            authCode: AUTH_CODE.MEMBER.INFO.PAGE,
            hiddenFromNav: true,
            breadcrumbParentPath: 'member/list', // 前一層的頁面路由，用於麵包屑
            breadcrumbParentTitle: '會員資料' // 前一層的頁面標題，用於麵包屑
          },
          {
            path: 'list/info',
            pageTitle: '會員詳情',
            element: <MemberInfo />,
            authCode: AUTH_CODE.MEMBER.INFO.PAGE,
            hiddenFromNav: true,
            breadcrumbParentPath: 'member/list',
            breadcrumbParentTitle: '會員資料'
          },
          {
            path: 'downloadInfo',
            pageTitle: '會員資料下載',
            element: <MemberInfoDownload />,
            authCode: AUTH_CODE.MEMBER.DOWNLOAD_INFO.PAGE
          },
          {
            path: 'special-type',
            pageTitle: '特殊會員類型',
            element: <SpecialTypeMember />,
            authCode: AUTH_CODE.MEMBER.SPECIAL.PAGE
          },
          {
            path: 'batch',
            pageTitle: '批量設定特殊會員',
            element: <BatchMembers />,
            authCode: AUTH_CODE.MEMBER.BATCH_SETTING.PAGE
          }
        ]
      }
    ]
  },
  {
    path: routerPath.backstage, // 路由的路徑
    element: <div>我是尚未建立的後台，你想要幹嘛 (•̀へ •́ ╮ )</div> // 當訪問 '/backstage' 路由時要渲染的元件
  },
  {
    path: '*', // 匹配任何未在前面定義的路徑
    element: <RedirectUrl /> // 當訪問任何未在前面定義的路徑時，將渲染此元件
  }
];

routerConfig.forEach(applyHasAuth);

const router = createBrowserRouter(routerConfig);

export default router;
