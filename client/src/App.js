import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';

import router from './routes/router';
// import PageRoute from 'pages/PagesRoute';

import Loading from 'components/loading/Loading';

function App() {
  const isFetchLoading = useSelector((state) => state.loading);
  return (
    <>
      <Loading isLoading={isFetchLoading} />
      <RouterProvider router={router} />
      {/* <PageRoute /> */}
    </>
  );
}

export default App;
