import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from 'services/api';
import { Form, Button } from 'react-bootstrap';
import loginBg from 'assets/images/loginBg.png';
import logo from 'assets/images/logo.svg';
import './loginStyle.scss';
import TextField from 'features/textField/TextField';
import homePageType from 'constants/homePageType';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/login/Login.js',
  _NOTICE: ''
});

const _defaultValues = {
  act: '',
  pwd: ''
};

const _schema = yup.object({
  act: yup.string().required('請輸入帳號').max(20, '最長度字數為20個字'),
  pwd: yup.string().required('請輸入密碼').max(20, '最長度字數為20個字')
});

function Login() {
  const navigate = useNavigate();
  /* ----Form Config---- */
  const methods = useForm({
    defaultValues: _defaultValues,
    resolver: yupResolver(_schema)
  });

  /* 送出登入 */
  const handleSubmit = async (values) => {
    try {
      api.auth
        .login(values)
        .then((res) => {
          if (!res) throw new Error('Login failed');
          localStorageUtil.setItem(LocalStorageKeys.UserInfo, res);
          return api.auth.getAuthInfo(values);
        })
        .then((resAuthInfo) => {
          if (!resAuthInfo) return;
          const authItems = resAuthInfo.authItems;
          const homePage = resAuthInfo.homePage;
          const isAdmin = resAuthInfo.isAdmin;
          const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
          localStorageUtil.setItem(LocalStorageKeys.UserInfo, {
            ...userInfo,
            authItems,
            homePage, // home, member
            isAdmin
          });
          // 根據使用者權限 跳轉頁面
          if (homePage) {
            navigate(homePageType[homePage]);
          } else {
            navigate('/');
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    } catch (error) {
      _EHS.errorReport(error, 'postCustLogin', _EHS._LEVEL.ERROR);
      return Promise.reject(error);
    }
  };

  return (
    <div id='reward-list-7c7d9de4-a36d-434a-a42d-43ce647f437a'>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(handleSubmit)}>
          <div
            className='login-container d-flex'
            style={{ backgroundImage: `url(${loginBg})` }}
          >
            <div className='login-modal d-flex'>
              <div className='login-inner d-flex flex-column'>
                <div className='login-content d-flex flex-column align-items-center'>
                  <img className='login-logo p-2' src={logo} alt='logo' />
                  <h5 className='login-title'>管理系統</h5>
                </div>
                <div className='login-input-group w-100'>
                  {/* 帳號 */}
                  <label className='input-label'>帳號</label>
                  <Controller
                    name='act'
                    control={methods.control}
                    defaultValue=''
                    render={({ field: { ref, ...inputProps } }) => (
                      <TextField
                        {...inputProps}
                        className='flex-fill'
                        maxLength={20}
                        placeholder='請輸入帳號'
                        size='lg'
                        autoComplete='off'
                      />
                    )}
                  />
                </div>
                <div className='login-input-group w-100'>
                  {/* 密碼 */}
                  <label className='input-label'>密碼</label>
                  <Controller
                    name='pwd'
                    control={methods.control}
                    defaultValue=''
                    render={({ field: { ref, ...inputProps } }) => (
                      <TextField
                        {...inputProps}
                        type='password'
                        variant='password'
                        className='flex-fill'
                        maxLength={20}
                        placeholder='請輸入密碼'
                        size='lg'
                        autoComplete='off'
                      />
                    )}
                  />
                </div>
                <div className='login-button-group'>
                  <Button className='login-btn w-100' type='submit'>
                    登入
                  </Button>
                </div>
              </div>
            </div>
            <footer className='login-footer w-100'>
              Copyright © 2023 19Life.
            </footer>
          </div>
        </Form>
      </FormProvider>
    </div>
  );
}

export default Login;
