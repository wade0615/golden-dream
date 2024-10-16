import React, { useState, useEffect, useCallback } from 'react';
// import '@wcj/dark-mode';
import MarkdownEditor from '@uiw/react-markdown-editor';
// import { useNavigate } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
// import api from 'services/api';

import './postsPageStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/PostPage.js',
  _NOTICE: ''
});

/** 文章頁  */
const PostPage = () => {
  const mdStr = `# H1 \n## H2 \n## H3 \n## H4 \n## H5 \n## H6 \n\n**bold** \n*italic* \n~~strikethrough~~ \n\n[link](https://www.google.com) \n\n\`inline code\` \n\`\`\` \nblock code \n\`\`\` \n\n- list \n- list \n- list \n\n1. list \n2. list \n3. list \n\n> blockquote \n\n--- \n\n![image](https://www.google.com) \n\n| table | table | \n| ----- | ----- | \n| table | table | \n\n`;

  const [markdown, setMarkdown] = useState(mdStr);

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      console.log('Page PostPage', JSON.stringify(mdStr));
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, []);

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
