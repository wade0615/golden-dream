import { useEffect } from 'react';
import {
  RouterProvider,
  useLocation,
  useNavigationType
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactGA from 'react-ga4';

import router from './routes/router';
// import PageRoute from 'pages/PagesRoute';

import Loading from 'components/loading/Loading';

function GaTracker() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search
    });
  }, [location, navigationType]);

  return null;
}

function App() {
  const isFetchLoading = useSelector((state) => state.loading);

  useEffect(() => {
    // 初始化 Google Analytics，將 'G-XXXXXXXXXX' 替換為你的測量 ID
    ReactGA.initialize('G-6ZWSTSVNRP');

    // 設定頁面檢視追蹤
    // ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  return (
    <>
      <Loading isLoading={isFetchLoading} />
      <RouterProvider router={router} />
      <GaTracker />
      {/* <PageRoute /> */}
    </>
  );
}

export default App;
