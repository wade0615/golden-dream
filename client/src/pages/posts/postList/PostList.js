import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import routerPath from 'routes/router.path';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';

import './postsListStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';
import { GetPostsClass } from './getPostsClass';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/Posts.js',
  _NOTICE: ''
});

/** 文章列表  */
const PostList = () => {
  /** 文章列表 */
  const [listData, setListData] = useState([]);
  /** 分頁資料 */
  const [pageMeta, setPageMeta] = useState({
    page: 1, //當前頁數
    perPage: 10, // 每頁筆數
    totalCount: 0, //總筆數
    totalPages: 0 // 總頁數
  });

  const navigate = useNavigate();

  /** 取得文章列表 */
  const getPostList = useCallback(async (page = 1, perPage = 10) => {
    try {
      const apiReq = {
        perPage: perPage,
        page: page
      };
      const res = await api.posts.getPostList(apiReq);
      const apiRes = res;
      if (apiRes) {
        const res = new GetPostsClass(apiRes);
        return res;
      }
    } catch (error) {
      _EHS.errorReport(error, 'getPostList', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      const postList = await getPostList();
      const metaData = postList.metaData;
      const posts = postList.postList;
      setPageMeta(metaData);
      setListData(posts);
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, [getPostList]);

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
    const postList = await getPostList(page, pageMeta.perPage);
    const metaData = postList.metaData;
    const posts = postList.postList;
    setPageMeta(metaData);
    setListData(posts);
  };

  return (
    <div id='posts' className='posts_container'>
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
              <span className='posts_item_tag'>{post.tag}</span>
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

export default PostList;
