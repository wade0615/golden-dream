import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';
import routerPath from 'routes/router.path';

import './categoriesStyle.scss';

import { GetCategoryListClass } from './getCategoryListClass';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/categories/categoryList/Categories.js',
  _NOTICE: ''
});

/** 文章分類  */
const Categories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();

  /** 取得文章分類列表 */
  const getCategoryList = useCallback(async (page = 1, perPage = 10) => {
    try {
      const apiReq = {
        perPage: perPage,
        page: page
      };
      const res = await api.category.getCategoryList(apiReq);
      if (res) {
        const apiRes = res.map((item) => new GetCategoryListClass(item));

        return apiRes;
      }
    } catch (error) {
      _EHS.errorReport(error, 'getCategoryList', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      console.log('Page Categories');
      const categoryList = await getCategoryList();

      if (categoryList) {
        setCategoryList(categoryList);
      }
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, [getCategoryList]);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <div id='categories' className='categories_container'>
      <ul className='categories_list'>
        {categoryList.map((item, index) => {
          return (
            <li
              key={index}
              className='categories_item'
              onClick={() => {
                navigate(
                  `/${routerPath.categories}/${routerPath.categoryPostsPage}?id=${item.id}`,
                  {}
                );
              }}
            >
              <p className='categories_item_title'>{item.name}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Categories;
