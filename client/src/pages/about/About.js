import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
// import api from 'services/api';
import routerPath from 'routes/router.path';

import './aboutStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/about/About.js',
  _NOTICE: ''
});

/** 關於我  */
const About = () => {
  const navigate = useNavigate();

  /** 分頁資料 */
  const [aboutDescription, setAboutDescription] = useState({
    title: '<title> About me </title>',
    name: '<name> Wade WU </name>',
    location: '<location> New Taipei City,TW </location>',
    email: '<email> wsw0615@gmail.com </email>'
  });

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      console.log('Page About');
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 前往密門 */
  const getSecretDoor = useCallback(async () => {
    try {
      navigate(`/${routerPath.login}`);
    } catch (error) {
      _EHS.errorReport(error, 'getSecretDoor', _EHS._LEVEL.ERROR);
    }
  }, [navigate]);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <div id='about' className='about_container'>
      <h1>板手之前人人平等</h1>
      <h1>Life is</h1>
      <h1>Love In Full Experience.</h1>
      <div>{aboutDescription.title}</div>
      <div>{aboutDescription.name}</div>
      <div>{aboutDescription.location}</div>
      <div>{aboutDescription.email}</div>

      <div onClick={getSecretDoor}>SecretDoor</div>
    </div>
  );
};

export default About;
