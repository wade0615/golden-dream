import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
// import api from 'services/api';

import './categoriesStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/categories/Categories.js',
  _NOTICE: ''
});

/** 文章分類  */
const Categories = () => {
  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      console.log('Page Categories');
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <div id='categories' className='categories_container'>
      Categories
    </div>
  );
};

export default Categories;
