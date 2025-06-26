import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import routerPath from 'routes/router.path';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';

import './categoryPostsPageStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';
import { GetCategoryPostListClass } from './getCategoryPostListClass';

const _EHS = new ExceptionHandleService({
  _NAME: 'categories/CategoryPostPage/CategoryPostsList.js',
  _NOTICE: ''
});

/** 分類文章列表  */
const CategoryPostsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  /** 文章列表 */
  const [listData, setListData] = useState([]);
  /** 分頁資料 */
  const [pageMeta, setPageMeta] = useState({
    page: 1, //當前頁數
    perPage: 10, // 每頁筆數
    totalCount: 0, //總筆數
    totalPages: 0 // 總頁數
  });
  const categoryId = useMemo(
    () => new URLSearchParams(location.search).get('id'),
    [location.search]
  );
  const categoryName = useRef(location?.state?.categoryName);

  /** 取得分類文章列表 */
  const getCategoryPostList = useCallback(
    async (categoryId, page = 1, perPage = 10) => {
      try {
        if (!categoryId) {
          throw new Error('categoryId is required');
        }
        const apiReq = {
          categoryId: categoryId,
          perPage: perPage,
          page: page
        };
        const res = await api.category.getCategoryPostList(apiReq);
        const apiRes = res;
        if (apiRes) {
          const res = new GetCategoryPostListClass(apiRes);
          return res;
        }
      } catch (error) {
        _EHS.errorReport(error, 'getCategoryPostList', _EHS._LEVEL.ERROR);
      }
    },
    []
  );

  /** 初次載入 */
  const getInit = async () => {
    try {
      const postList = await getCategoryPostList(categoryId);
      const metaData = postList.metaData;
      const posts = postList.postList;
      setPageMeta(metaData);
      setListData(posts);
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  };

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  /* 前往文章詳情頁 */
  const handlePostDetail = (id) => {
    navigate(`/${routerPath.posts}/${routerPath.postPage}?id=${id}`, {});
  };

  /* 上下頁切換 */
  const handlePageFetch = async (page) => {
    const postList = await getCategoryPostList(page, pageMeta.perPage);
    const metaData = postList.metaData;
    const posts = postList.postList;
    setPageMeta(metaData);
    setListData(posts);
  };

  return (
    <div id='category_posts_page' className='posts_container'>
      <div className='posts_title'>
        <h1 className='posts_title_name'>分類 - {categoryName.current}</h1>
      </div>
      {/* 列表 */}
      <div className='posts_list'>
        {listData?.length > 0 &&
          listData.map((post, index) => (
            <div
              key={`post_id_${index}`}
              className='posts_item'
              onClick={() => handlePostDetail(post.id)}
            >
              <h2 className='posts_item_title'>{post.title}</h2>
              <time className='posts_item_date'>{post.date}</time>
              <span className='posts_item_category'>{post.category}</span>
              <div className='posts_item_content'>{post.content}</div>
            </div>
          ))}
      </div>
      {/* 分頁 */}
      <div className='posts_pagination'>
        <div className='posts_pagination_info'>
          共 {pageMeta.totalCount} 筆，共 {pageMeta.totalPages} 頁
        </div>
        <div className='posts_pagination_page'>
          <button
            onClick={() =>
              handlePageFetch(pageMeta.page > 1 ? pageMeta.page - 1 : 1)
            }
            disabled={pageMeta.page === 1}
          >
            上一頁
          </button>
          <button
            onClick={() =>
              handlePageFetch(
                pageMeta.page < pageMeta.totalPages && pageMeta.totalPages > 1
                  ? pageMeta.page + 1
                  : 1
              )
            }
            disabled={pageMeta.page === pageMeta.totalPages}
          >
            下一頁
          </button>
        </div>
      </div>
    </div>
  );
};
export default CategoryPostsPage;
