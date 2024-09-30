import React, { useState, useEffect, useCallback } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
// import { useNavigate } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
// import api from 'services/api';

// import './aboutStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/about/About.js',
  _NOTICE: ''
});

/** 文章頁  */
const PostPage = () => {
  const mdStr = `# This is a H1  \n## This is a H2  \n###### This is a H6`;

  const [markdown, setMarkdown] = useState(mdStr);

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      console.log('Page PostPage');
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <div id='about' className='about_container'>
      PostPage
      <MarkdownEditor
        value={markdown}
        height='200px'
        onChange={(value, viewUpdate) => {
          console.log('value:', value);
          setMarkdown(value);
        }}
      />
      <hr />
      <MarkdownEditor.Markdown source={mdStr} height='200px' />
    </div>
  );
};

export default PostPage;
