import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
// import api from 'services/api';

import './timelineStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/timeline/Timeline.js',
  _NOTICE: ''
});

/** 時間軸  */
const Timeline = () => {
  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      console.log('Page timeline');
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <div id='timeline' className='timeline_container'>
      Timeline
    </div>
  );
};

export default Timeline;
