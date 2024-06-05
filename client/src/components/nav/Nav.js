import { memo, useState, useContext } from 'react';
import { NavLink, useMatch, useLocation, useNavigate } from 'react-router-dom';
import { routerConfig } from 'routes/router';

// import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import AccordionContext from 'react-bootstrap/AccordionContext';
import Accordion from 'react-bootstrap/Accordion';
import { ArrowDropUp, ArrowDropDown } from 'assets/icons';
import './navStyle.scss';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import { SIDE_MENU_CHECK_AUTH } from 'config/config';

/* nav-item */
function NavItem({ linkTo = '', title = '', subPath = [] }) {
  const match = useMatch(linkTo);
  const location = useLocation();
  // 檢查當前的 URL 是否包含任何 subPath
  // const isActiveSubPath = subPath.some((path) =>
  //   location.pathname.includes(`/${path}`)
  // );
  // 檢查當前的 URL 是否在特定位置有子路徑
  const isActiveSubPath = subPath.some(
    (path) =>
      location.pathname.startsWith(`/${path}`) ||
      location.pathname.endsWith(`/${path}`)
  );
  const activeClass = match || isActiveSubPath ? 'active-link-small' : '';
  // const activeClass = match ? 'active-link-small' : '';
  return (
    <nav>
      <NavLink
        className={`nav-item ${activeClass}`}
        to={linkTo}
        aria-label={title}
      >
        {title}
      </NavLink>
    </nav>
  );
}
// const NavItem = memo(({ linkTo = '', title = '' }) => {
//   return (
//     <nav>
//       <NavLink className='nav-item' to={linkTo} aria-label={title}>
//         {title}
//       </NavLink>
//     </nav>
//   );
// });

/* nav-accordion */
function ContextAwareToggle({
  children,
  eventKey,
  // callback,
  path,
  isOpen,
  title,
  onToggle
}) {
  const location = useLocation();
  const { activeEventKey } = useContext(AccordionContext);
  const navigate = useNavigate();

  // const decoratedOnClick = useAccordionButton(
  //   eventKey,
  //   () => callback && callback(eventKey)
  // );

  const isCurrentActive = activeEventKey.includes(eventKey);
  const pathArr = location?.pathname.split('/');
  const isCurrentPath = pathArr?.find((item) => item === path);

  const handleClick = () => {
    if (!isOpen) {
      navigate(path);
    } else {
      onToggle();
    }
  };
  const baseOffset = -16; // 基礎偏移量
  const offsetPerChar = 4; // 每個字增加的偏移量
  const leftOffset = `${baseOffset + offsetPerChar * title.length}px`;

  return (
    <div
      className={`nav-accordion__Header ${
        isOpen ? 'nav-accordion__Header-open' : 'nav-accordion__Header-closed'
      }
    ${
      isCurrentPath ? (isOpen ? 'active-link-medium' : 'active-link-large') : ''
    }`}
      style={{ '--left-offset': isCurrentPath && !isOpen ? leftOffset : '0px' }}
      onClick={handleClick}
    >
      <div className='nav-title'>
        <span>{children}</span>
        {isOpen && isCurrentActive && <ArrowDropUp />}
        {isOpen && !isCurrentActive && <ArrowDropDown />}
      </div>
    </div>
  );
}

function NavAccordion({
  title = '會員管理',
  eventKey = '0',
  path,
  children,
  isOpen,
  icon
}) {
  // 從 localStorage 中取得用戶資料
  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  // 檢查是否需要驗證用戶權限
  const checkAuth = !!userInfo && SIDE_MENU_CHECK_AUTH;
  // 驗證用戶是否具有指定的權限
  const hasAuth = (authCode) => {
    if (!checkAuth) return true; // 如果不需要檢查權限，則預設為有權限
    return (
      Array.isArray(userInfo.authItems) && userInfo.authItems.includes(authCode)
    );
  };
  // 設置和取得當前的 activeKey，從 localStorage 中獲取並設置初始值
  const [activeKey, setActiveKey] = useState(() => {
    const savedMenuState =
      localStorageUtil.getItem(LocalStorageKeys.SetSideMenu) || {};
    return savedMenuState[path] === false ? '' : eventKey; // 若 localStorage 中的該路由狀態是 false，則初始狀態為關閉
  });
  return (
    <Accordion className='nav-accordion' activeKey={activeKey}>
      <ContextAwareToggle
        eventKey={eventKey}
        path={path}
        isOpen={isOpen}
        title={title}
        onToggle={() => {
          const newActiveKey = activeKey ? '' : eventKey; // 切換 activeKey 的值
          setActiveKey(newActiveKey);
          const savedMenuState =
            localStorageUtil.getItem(LocalStorageKeys.SetSideMenu) || {};
          // 更新 localStorage 中的路由狀態
          localStorageUtil.setItem(LocalStorageKeys.SetSideMenu, {
            ...savedMenuState,
            [path]: !!newActiveKey // 若 newActiveKey 存在，則狀態為打開
          });
        }}
      >
        {!isOpen ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div>{icon}</div>
            <div className='nav-title no-wrap collapsed'>{title}</div>
          </div>
        ) : (
          <div className='nav-title'>{title}</div>
        )}
      </ContextAwareToggle>
      {isOpen && (
        <Accordion.Collapse eventKey={eventKey}>
          <div className='nav-accordion__collapse'>
            {children
              .filter((childRoute) => hasAuth(childRoute.authCode)) // 透過 filter 過濾掉沒有權限的路由
              .map(
                (childRoute, index) =>
                  !childRoute.hiddenFromNav && (
                    <NavItem
                      key={index}
                      linkTo={`${path}/${childRoute.path || ''}`.replace(
                        '//',
                        '/'
                      )}
                      title={childRoute.pageTitle}
                      subPath={childRoute.subPath}
                    />
                  )
              )}
          </div>
        </Accordion.Collapse>
      )}
    </Accordion>
  );
}

/* nav */
const Nav = memo(function Nav({ isOpen }) {
  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  const checkAuth = !!userInfo && SIDE_MENU_CHECK_AUTH;
  const hasAuth = (authCode) => {
    if (!checkAuth) return true; // 如果不需要檢查權限，則預設為有權限
    // 檢查是否有適當的權限
    return (
      Array.isArray(userInfo.authItems) && userInfo.authItems.includes(authCode)
    );
  };
  const classSuffix = isOpen ? 'open' : 'closed';
  return (
    <div
      className={`nav nav-${classSuffix}`}
      style={
        isOpen
          ? { display: 'block' }
          : { display: 'flex', justifyContent: 'center' }
      }
    >
      {/* <NavAccordion /> */}
      {routerConfig[2].children
        .filter((route) => hasAuth(route.authCode)) // 透過 filter 過濾掉沒有權限的路由
        .map((route, index) => (
          <NavAccordion
            key={index}
            title={isOpen ? route.pageTitle : route.shortTitle}
            path={route.path}
            children={route.children}
            isOpen={isOpen}
            icon={route.sidebarIcon}
          />
        ))}
    </div>
  );
});

export default Nav;
