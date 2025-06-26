import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useLocation, useNavigate } from 'react-router-dom';

import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'react-bootstrap';
import TextField, { FieldGroup } from 'features/textField/TextField';
import { DefaultLayout } from 'layout';

import { varifyLoginToken } from 'utils/commonUtil';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
import api from 'services/api';
import routerPath from 'routes/router.path';

import './postsPageCRUDStyle.scss';
import { GetBackstagePostByIdClass } from './getBackstagePostByIdClass';
import { GetBackstageCategoryOptionsClass } from './getBackstageCategoryOptionsClass';

import alert from 'utils/alertService';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/posts/PostPageCRUD.js',
  _NOTICE: ''
});

const _defaultValues = {
  title: '',
  category: '',
  shortContent: '',
  isPublish: '0'
};
// form 驗證
const _schema = yup.object({
  title: yup
    .string()
    .required('請輸入正確標題格式')
    // .matches(/^[\u4E00-\u9FFFa-zA-Z]+$/, '請輸入正確標題格式')
    .min(2, '請輸入大於2位中英字')
    .max(50, '請輸入小於50位中英字'),
  category: yup.string().required('請選擇分類'),
  shortContent: yup
    .string()
    .required('請給我一點內容')
    .min(2, '請輸入大於2位中英字')
    .max(100, '請輸入小於100位中英字')
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
  const [categoryOptions, setCategoryOptions] = useState([]);
  // const [formData, setFormData] = useState({});

  // 頁面狀態狀態 add/edit/view
  const pageMode = location?.state?.pageMode;
  const isAddMode = pageMode === 'add';
  const isViewMode = pageMode === 'view';
  // const isEditMode = pageMode === 'edit';

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
  const getBackStagePostById = useCallback(async (postId) => {
    try {
      if (!postId) {
        throw new Error('postId is required');
      }
      const apiReq = {
        postId: postId
      };
      const apiRes = await api.backStage.getBackStagePostById(apiReq);
      if (apiRes) {
        const res = new GetBackstagePostByIdClass(apiRes);
        return res;
      }
    } catch (error) {
      _EHS.errorReport(error, 'getBackStagePostById', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 取得分類下拉選單 */
  const getBackStageCategoryOptions = useCallback(async () => {
    try {
      const apiRes = await api.backStage.getBackStageCategoryOptions();
      if (apiRes) {
        const res = apiRes?.map((_apiRes) => {
          return new GetBackstageCategoryOptionsClass(_apiRes);
        });
        return res;
      }
    } catch (error) {
      _EHS.errorReport(error, 'getBackStageCategoryOptions', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初次載入 */
  const getInit = async () => {
    try {
      const categoryOptions = await getBackStageCategoryOptions();
      setCategoryOptions(categoryOptions);

      if (isAddMode) {
      } else {
        const postInfo = await getBackStagePostById(postId);
        const postTitle = postInfo?.title;
        const postCategory = postInfo?.category;
        const postCreatedDate = postInfo?.createdDate;
        const postContent = postInfo?.content;
        const postShortContent = postInfo?.shortContent;
        setPostTitle(postTitle);
        setPostCategory(postCategory);
        setPostCreateDate(postCreatedDate);
        setMarkdown(postContent);

        const formateData = {
          title: postTitle ?? '',
          category: postCategory ?? '',
          shortContent: postShortContent ?? '',
          isPublish: postInfo?.isPublish ?? '0'
        };

        reset(formateData);
        // setFormData(formateData);
      }
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  };

  /** 初始化 */
  useEffect(() => {
    varifyLoginToken();
    getInit();
  }, [getInit]);

  /* 送出表單 */
  const handleSubmit = async (data, e) => {
    e.preventDefault();

    // 新增文章
    if (isAddMode) {
      const reqBody = {
        postName: data.title,
        category: data.category,
        content: markdown,
        shortContent: data.shortContent,
        // postType: 2,
        isPublish: data.isPublish
      };
      const res = await api.backStage.postBackStageAddPost(reqBody);
      if (res) {
        await alert
          .toast({ title: '新增文章成功' })
          .then(() =>
            navigate(
              `/${routerPath.secretDoor}/${routerPath.secretDoor_Post}/${routerPath.secretDoor_Post_PostList}`
            )
          );
      }
    } else {
      // 編輯文章
      const reqBody = {
        postId: postId,
        postName: data.title,
        category: data.category,
        content: markdown,
        shortContent: data.shortContent,
        // postType: 2,
        isPublish: data.isPublish
      };
      const res = await api.backStage.patchBackStageEditPost(reqBody);
      if (res) {
        await alert
          .toast({ title: '編輯文章成功' })
          .then(() =>
            navigate(
              `/${routerPath.secretDoor}/${routerPath.secretDoor_Post}/${routerPath.secretDoor_Post_PostList}`
            )
          );
      }
    }
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
          <DefaultLayout.Outlet
            onCancel={handleGoBack}
            onCancelText={isViewMode ? '返回' : '取消'}
            hiddenSaveBtn={isViewMode}
          >
            <div className='form-grid form-grid-md-2 mb-4'>
              {/* 文章標題 */}
              <FieldGroup title='文章標題' required htmlFor='title'>
                <TextField name='title' maxLength='50' disabled={isViewMode} />
              </FieldGroup>
              {/* 文章分類 */}
              <FieldGroup title='文章分類'>
                <TextField
                  name='category'
                  variant='select'
                  disabled={isViewMode}
                  maxLength='50'
                  placeholder='全部'
                  options={categoryOptions}
                />
              </FieldGroup>
            </div>
            <div className='mb-2'>
              {/* 文章是否發布 */}
              <FieldGroup title='是否發布' htmlFor='isPublish'>
                <TextField
                  variant='radio'
                  name='isPublish'
                  options={[
                    { label: '發布', value: '1' },
                    { label: '不發布', value: '0' }
                  ]}
                />
              </FieldGroup>
            </div>
            <div className='mb-2'>
              {/* 文章短敘述 */}
              <FieldGroup title='短敘述' htmlFor='shortContent'>
                <TextField variant='textarea' name='shortContent' />
              </FieldGroup>
            </div>
            <div className='post_editor' data-color-mode='light'>
              <MarkdownEditor
                value={markdown}
                height='60vh'
                visible={true}
                visibleEditor={true}
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
