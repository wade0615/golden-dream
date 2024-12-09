import React, { useState, useEffect, useCallback } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
// import { useNavigate } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
// import api from 'services/api';

import './postsPageCRUDStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/PostPageCRUD.js',
  _NOTICE: ''
});

/** 文章編輯頁  */
const PostPageCRUD = () => {
  const mdStr = `# This is a H1  \n## This is a H2  \n###### This is a H6`;

  const [markdown, setMarkdown] = useState(mdStr);

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      console.log('Page PostPage CRUD');
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
          height='200px'
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
