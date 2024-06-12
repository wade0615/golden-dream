import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';

import './postsStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/Posts.js',
  _NOTICE: ''
});

/** 文章列表  */
function Posts() {
  // 初始化
  useEffect(() => {
    try {
      (async () => {
        console.log('Page Posts');
      })();
    } catch (error) {
      _EHS.errorReport(error, 'Page Posts', _EHS._LEVEL.ERROR);
    }
  }, []);

  return (
    <div id='posts'>
      <h1>Posts</h1>
    </div>
  );
}

export default Posts;
