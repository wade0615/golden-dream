import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useLocation, useNavigate } from 'react-router-dom';

import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'react-bootstrap';
import TextField, { FieldGroup } from 'features/textField/TextField';
import { DefaultLayout } from 'layout';

// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';
import routerPath from 'routes/router.path';

import './postsPageCRUDStyle.scss';
import { GetBackstagePostByIdClass } from './getBackstagePostByIdClass';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/PostPageCRUD.js',
  _NOTICE: ''
});

const _defaultValues = {
  title: '',
  category: ''
};
// form 驗證
const _schema = yup.object({
  title: yup
    .string()
    .required('請輸入正確標題格式')
    // .matches(/^[\u4E00-\u9FFFa-zA-Z]+$/, '請輸入正確標題格式')
    .min(2, '請輸入大於2位中英字')
    .max(50, '請輸入小於50位中英字')
});

/** 文章編輯頁  */
const PostPageCRUD = () => {
  const mdStr = `# This is a H1  \n## This is a H2  \n###### This is a H6`;

  const location = useLocation();
  const navigate = useNavigate();
  const [postTitle, setPostTitle] = useState(null);
  const [postCategory, setPostCategory] = useState(null);
  const [postCreateDate, setPostCreateDate] = useState(null);
  const [markdown, setMarkdown] = useState(mdStr);
  const [formData, setFormData] = useState({});

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: _defaultValues,
    resolver: yupResolver(_schema)
  });
  const { reset } = methods;

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
      const postInfo = await getPostById(postId);
      const postTitle = postInfo?.title;
      const postCategory = postInfo?.category;
      const postCreatedDate = postInfo?.createdDate;
      const postContent = postInfo?.content;
      setPostTitle(postTitle);
      setPostCategory(postCategory);
      setPostCreateDate(postCreatedDate);
      setMarkdown(postContent);

      const formateData = {
        title: postTitle ?? '',
        category: postCategory ?? ''
      };

      reset(formateData);
      setFormData(formateData);
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, [getPostById, postId, reset]);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  /* 送出表單 */
  const handleSubmit = async (data, e) => {
    e.preventDefault();
    const reqBody = {
      title: data.title,
      category: data.category,
      content: markdown
    };
    console.log(reqBody);
    // const res = await api.member.addMemberDetail(reqBody);
    // if (res) {
    //   await alert
    //     .toast({ title: '新增會員成功' })
    //     .then(() => navigate('/member/list'));
    // }
  };
  const handleGoBack = () => {
    navigate(
      `/${routerPath.secretDoor}/${routerPath.secretDoor_Post}/${routerPath.secretDoor_Post_PostList}`
    );
  };

  return (
    <div id='post_page_crud' className='post_container'>
      <FormProvider {...methods}>
        {/* <DevTool control={methods.control} /> */}
        <Form onSubmit={methods.handleSubmit(handleSubmit)}>
          <DefaultLayout.Outlet onCancel={handleGoBack}>
            <div className='form-grid form-grid-md-2'>
              {/* 文章標題 */}
              <FieldGroup title='文章標題' required htmlFor='title'>
                <TextField name='title' maxLength='50' />
              </FieldGroup>
              {/* 文章分類 */}
              <FieldGroup title='文章分類'>
                <TextField name='category' disabled readOnly maxLength='50' />
              </FieldGroup>
            </div>
            <div className='post_editor' data-color-mode='light'>
              <MarkdownEditor
                value={markdown}
                height='60vh'
                visible={true}
                onChange={(value, viewUpdate) => {
                  setMarkdown(value);
                }}
              />
            </div>
          </DefaultLayout.Outlet>
        </Form>
      </FormProvider>
      <dark-mode light='Light' dark='Dark'></dark-mode>
    </div>
  );
};

export default PostPageCRUD;
