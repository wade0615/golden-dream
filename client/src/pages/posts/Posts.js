import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';

import './postsStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';
import { GetPostsClass } from './getPostsClass';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/Posts.js',
  _NOTICE: ''
});

// api 回傳的文章列表
const resPosts = {
  metaData: {
    page: 1,
    perPage: 10,
    totalCount: 66,
    totalPages: 7
  },
  postList: [
    {
      id: 1,
      title: 'title 1',
      date: '2021-10-01',
      tag: 'tag 1',
      content: 'content 1'
    },
    {
      id: 1,
      title: 'title 2',
      date: '2021-11-11',
      tag: 'tag 2',
      content: 'content 2'
    }
  ]
};

/** 文章列表  */
const Posts = () => {
  /** 文章列表 */
  const [listData, setListData] = useState([]);
  /** 分頁資料 */
  const [pageMeta, setPageMeta] = useState({
    page: 1, //當前頁數
    perPage: 20, // 每頁筆數
    totalCount: 0, //總筆數
    totalPages: 0 // 總頁數
  });

  /** 取得文章列表 */
  const getPostList = useCallback(async (req) => {
    try {
      // const res = await api.post.getPosts();
      const apiRes = resPosts;
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
      console.log('Page Posts');
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

  return (
    <div id='posts' className='posts_container'>
      {/* 列表 */}
      <div className='posts_list'>
        {listData?.length > 0 &&
          listData.map((post) => (
            <div key={post.id} className='posts_item'>
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
          <button>上一頁</button>
          <button>下一頁</button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
