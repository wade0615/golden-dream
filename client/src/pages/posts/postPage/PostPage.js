import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import '@wcj/dark-mode';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useLocation } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';

import './postsPageStyle.scss';

import { GetPostByIdClass } from './getPostByIdClass';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/PostPage.js',
  _NOTICE: ''
});

/** 文章頁  */
const PostPage = () => {
  // const mdStr = `# H1\n## H2 \n## H3 \n## H4 \n## H5 \n## H6 \n\n**bold** \n*italic* \n~~strikethrough~~ \n\n[link](https://www.google.com) \n\n\`inline code\` \n\`\`\` \nblock code \n\`\`\` \n\n- list \n- list \n- list \n\n1. list \n2. list \n3. list \n\n> blockquote \n\n--- \n\n![image](https://www.google.com) \n\n| table | table | \n| ----- | ----- | \n| table | table | \n\n`;
  const mdStr = ``;

  const location = useLocation();
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
        const res = new GetPostByIdClass(apiRes);
        return res;
      }
    } catch (error) {
      _EHS.errorReport(error, 'getPostById', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      const postInfo = await getPostById(postId);
      const postContent = postInfo?.content;
      setMarkdown(postContent);
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, [getPostById, postId]);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <div id='post_page' className='post_container'>
      <dark-mode light='Light' dark='Dark'></dark-mode>

      <div className='post_editor' data-color-mode='light'>
        <MarkdownEditor.Markdown source={markdown} height='200px' />
      </div>
    </div>
  );
};

export default PostPage;
