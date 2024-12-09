import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useLocation, useNavigate } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';

import './postsPageCRUDStyle.scss';
import { GetBackstagePostByIdClass } from './getBackstagePostByIdClass';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/PostPageCRUD.js',
  _NOTICE: ''
});

/** 文章編輯頁  */
const PostPageCRUD = () => {
  const mdStr = `# This is a H1  \n## This is a H2  \n###### This is a H6`;

  const location = useLocation();
  const [postTitle, setPostTitle] = useState(null);
  const [postCategory, setPostCategory] = useState(null);
  const [postCreateDate, setPostCreateDate] = useState(null);
  const [markdown, setMarkdown] = useState(mdStr);

  const postId = useMemo(
    () => new URLSearchParams(location.search).get('id'),
    [location.search]
  );

  /** 取得指定文章 */
  const getPostById = useCallback(async (postId) => {
    try {
      if (!postId) {
        throw new Error('postId is required');
      }
      const apiReq = {
        postId: postId
      };
      const res = await api.posts.getPostById(apiReq);
      const apiRes = res;
      if (apiRes) {
        const res = new GetBackstagePostByIdClass(apiRes);
        return res;
      }
    } catch (error) {
      _EHS.errorReport(error, 'getPostById', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      console.log('Page PostPage CRUD');

      const postInfo = await getPostById(postId);
      const postTitle = postInfo?.title;
      const postCategory = postInfo?.category;
      const postCreatedDate = postInfo?.createdDate;
      const postContent = postInfo?.content;
      setPostTitle(postTitle);
      setPostCategory(postCategory);
      setPostCreateDate(postCreatedDate);
      setMarkdown(postContent);
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <div id='post_page_crud' className='post_container'>
      <dark-mode light='Light' dark='Dark'></dark-mode>
      PostPage CRUD
      <div className='post_editor' data-color-mode='light'>
        <MarkdownEditor
          value={markdown}
          height='60vh'
          width='100%'
          onChange={(value, viewUpdate) => {
            console.log('value:', value);
            setMarkdown(value);
          }}
        />
      </div>
    </div>
  );
};

export default PostPageCRUD;
