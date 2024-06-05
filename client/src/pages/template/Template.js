// node_modules
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// utils
import { TemplateDataClass } from './templateClass';

// features || components
import AdvanceSearch from 'features/advanceSearch/AdvanceSearch';

// styles
import './templateStyle.scss';

/*  import ExceptionHandleService from 'utils/exceptionHandler';

 const _EHS = new ExceptionHandleService({
  _NAME: 'pages/template/Template.js',
  _NOTICE: ''
}); */

// form 預設值
const _defaultValues = {
  search: '',
  text0: '',
  text1: '',
  text2: '',
  text3: '',
  select: ''
};

// form 驗證
const _schema = yup
  .object({
    text0: yup.string().required('必填')
  })
  .required();

/* 
 - 最外層給包裹一個與頁面同名稱的 id，給 scop css 使用， 檔案名稱：{檔名}Style
 - 所有接 api 的資料統一使用 class function 清洗， 檔案名稱：{檔名}Class
 - 使用 classNames 動態管理傳入 css 的數量
*/
function Template() {
  const [data, setData] = useState(null);

  // react-hook-form
  const methods = useForm({
    defaultValues: _defaultValues,
    resolver: yupResolver(_schema)
  });

  //useEffect
  useEffect(() => {
    const newData = new TemplateDataClass();
    setData(newData);
  }, []);

  //handle functions
  const onSubmit = (data, e) => {
    e.preventDefault();
    console.log(data);
  };
  const onError = (errors, e) => console.log(errors);

  if (data === null) return null; // 若無資料，不渲染該畫面
  return (
    <div id='template-uuid'>
      <h1 className={classNames({ test: true })}>starter sample</h1>
      <AdvanceSearch
        searchBarName='search'
        methods={methods}
        onSubmit={onSubmit}
        onError={onError}
      ></AdvanceSearch>
      <p>test</p>
    </div>
  );
}

export default Template;
