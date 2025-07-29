import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';
import TextField from 'features/textField/TextField';
// import localStorageUtil from 'utils/localStorageUtil';
// import LocalStorageKeys from 'constants/localStorageKeys';
// import api from 'services/api';
import routerPath from 'routes/router.path';
import api from 'services/api';

import './aboutStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/about/About.js',
  _NOTICE: ''
});

/** 關於我  */
const About = () => {
  const navigate = useNavigate();
  const [sendMsgCount, setSendMsgCount] = useState(0);

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      tgName: '',
      tgMsg: ''
    }
    // resolver: yupResolver(_schema)
  });

  /** 特殊描述 */
  // const [aboutDescription, setAboutDescription] = useState({
  //   title: '<title> About me </title>',
  //   name: '<name> Wade WU </name>',
  //   location: '<location> New Taipei City,TW </location>',
  //   email: '<email> wsw0615@gmail.com </email>'
  // });

  /** 初次載入 */
  const getInit = useCallback(async () => {
    try {
      console.log('Page About');
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 前往密門 */
  const getSecretDoor = async () => {
    try {
      navigate(`/${routerPath.login}`);
    } catch (error) {
      _EHS.errorReport(error, 'getSecretDoor', _EHS._LEVEL.ERROR);
    }
  };

  /** 傳送訊息 */
  const sendMessage = async (tgName = '', tgMsg = '') => {
    try {
      const apiReq = {
        name: tgName,
        msg: tgMsg
      };
      const apiRes = await api.telegram.postTelegramMsg(apiReq);
      if (apiRes) {
        setSendMsgCount(sendMsgCount + 1);
        return apiRes;
      }
    } catch (error) {
      _EHS.errorReport(error, 'sendMessage', _EHS._LEVEL.ERROR);
    }
  };

  const handleSubmit = async (data) => {
    if (sendMsgCount >= 10) {
      alert('講太多話了吧？明天再來跟我說說話吧！');
      methods.reset({
        tgName: '',
        tgMsg: ''
      });
      return;
    }
    await sendMessage(data.tgName, data.tgMsg);
    methods.reset({
      tgName: '',
      tgMsg: ''
    });
  };

  /** 初始化 */
  useEffect(() => {
    getInit();
  }, [getInit]);

  return (
    <div id='about' className='about_container'>
      {/* <h2 className='DotGothic16'>{aboutDescription.title}</h2>
      <h2 className='DotGothic16'>{aboutDescription.name}</h2>
      <h2 className='DotGothic16'>{aboutDescription.location}</h2>
      <h2 className='DotGothic16'>{aboutDescription.email}</h2>
      <br />
      <hr /> */}
      <h4>
        你用什麼方式謀生，我不關心；
        <br />
        我想知道，你在追求什麼，你是否敢於做夢，
        <br />
        並去觸碰你內心的渴望。
        <br />
        <br />
        你的年齡多大，我不在乎；
        <br />
        我想知道，你是否願意像傻瓜一樣勇往直前，
        <br />
        為了愛、夢想，還有活著就該有的冒險。
      </h4>

      <p>
        當我回首過去的歲月，發現每一步的選擇都像是一顆拼圖，拼湊出今天的我。有些選擇是基於熱情，有些則是因為恐懼，但無論結果如何，每一次經歷都讓我更加了解自己。生活是一場冒險，而冒險的意義在於探索未知，無論是踏上一段遠方的旅程，還是挑戰自己內心深處的恐懼。
      </p>
      <p>
        曾經，我是一名機械設計工程師，面對的是精密的零件和公式，冰冷的鐵塊與僵化的格子桌。也曾穿上圍裙與襯衫，作為一名咖啡師品嚐著豆種間的變化，拿捏著義式咖啡機蒸氣的流轉。後來我明白，轉職不只是技能的轉換，更是一場心態與視野的蛻變。在機械設計中，我追求的是精密與準確；在咖啡師的工作中，我感受到的是人與人之間的連結。而現在，作為一名軟體工程師，我找到了一個能結合理性、創造力與生活間的平衡點。
      </p>
      <p>
        夢想對我來說，不只是目標，而是一種內心的指引，它讓我在迷失時仍能找到前行的方向。我喜歡發現世界的不同面貌，但更在乎的是在這些經歷中，如何改變看待世界的方式。無論是旅行、學習、工作，還是愛，我都試著以熱情與真誠投入其中。我相信，唯有不斷地探索未知，勇敢面對內心的渴望，才能看見生命更豐富的可能性。而這些經歷，也不斷提醒著我，生活的本質，不在於過得安穩，而在於過得有意義。
      </p>

      <h4>
        You don’t travel to see different things,
        <br />
        You travel to see things <span onClick={getSecretDoor}>different.</span>
      </h4>

      <hr />

      <h3 className='mb-4'>留下來過的足跡</h3>
      <FormProvider {...methods}>
        <Form
          noValidate
          onSubmit={methods.handleSubmit(handleSubmit)}
          className='about_form'
        >
          <TextField
            name='tgName'
            variant='text'
            placeholder='Your name'
            maxLength={50}
            formRules={{
              required: { value: true, message: '說點什麼吧' },
              validate: {
                maxLength: (value) => {
                  if (value && value.length > 50) {
                    return '字數已達上限 50 字';
                  }
                  return true;
                }
              }
            }}
            className='mb-3'
          />
          <TextField
            name='tgMsg'
            variant='textarea'
            placeholder='Say something'
            maxLength={200}
            lengthCount={true}
            formRules={{
              required: { value: true, message: '說點什麼吧' },
              validate: {
                maxLength: (value) => {
                  if (value && value.length > 200) {
                    return '字數已達上限 200 字';
                  }
                  return true;
                }
              }
            }}
            className='mb-3'
          />
          <div className='text-end'>
            <Button type='submit' className='ml-auto'>
              送出
            </Button>
          </div>
        </Form>
      </FormProvider>
    </div>
  );
};

export default About;
