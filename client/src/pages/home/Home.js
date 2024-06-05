import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import homePageType from 'constants/homePageType';
import api from 'services/api';
import { FormProvider, useForm } from 'react-hook-form';
import { Form, Stack } from 'react-bootstrap';
import { PersonIcon, StarIcon, CrownIcon, DiamondIcon } from 'assets/icons';
import { insertComma } from 'utils/commonUtil';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import './homeStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/home/Home.js',
  _NOTICE: ''
});

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const _defaultData = {
  totalMember: '', //累積總會員數
  memberShip: [
    {
      rate: '',
      count: ''
    }
  ],
  //會員性別
  gender: {
    male: '',
    female: '',
    other: ''
  },
  age: {} //會員年齡
};

const _defaultMemberShip = {
  icon: <StarIcon color='#D41C35' size='24' />,
  valueColor: '#e16c7b'
};

const _defaultMemberShipList = [
  {
    icon: <StarIcon color='#D41C35' size='24' />,
    valueColor: '#e16c7b'
  },
  {
    icon: <CrownIcon color='#C0C0C0' size='24' />,
    valueColor: '#C0C0C0'
  },
  {
    icon: <CrownIcon color='#F79307' size='24' />,
    valueColor: '#f89f32'
  },
  {
    icon: <DiamondIcon size='24' />,
    valueColor: '#C09BFF'
  }
];

// 考慮到中文字符和英文字符的視覺寬度差異
function getStringLength(str) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      length += 1;
    } else {
      length += 2; // 假設中文字符的視覺寬度約為英文字符的兩倍
    }
  }
  return length;
}

const _chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // 讓圖表更靈活地適應容器大小
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true, // 使用圓點風格
        pointStyle: 'circle', // 圖例前的樣式為圓形
        color: 'black', // 圖例文字顏色
        padding: 20, // 圖例項目之間的間距
        // font: {
        //   size: 14 // 圖例文字大小
        // },
        generateLabels: (chart) => {
          const { data } = chart;
          if (data.labels.length && data.datasets.length) {
            const { labels, datasets } = data;
            const maxLabelLength = 10; // 指定的最大標籤長度
            return labels.map((label, i) => {
              // 百分比的文字表示
              const percentageText = `${datasets[0].data[i]}%`;
              // 計算標籤的實際視覺長度
              const labelLength = getStringLength(label);
              // 計算需要補充的空格數，如果數值是 0 則增加 4 個空格
              const additionalPadding = datasets[0].data[i] === 0 ? 7 : 0;
              // 計算需要補充的空格數
              const paddingLength =
                maxLabelLength - labelLength + additionalPadding;
              const paddedLabel =
                label + ' '.repeat(paddingLength > 0 ? paddingLength : 0);
              // 組合標籤和百分比
              const text = `${paddedLabel} ${percentageText}`;
              return {
                text: text,
                fillStyle: datasets[0].backgroundColor[i],
                strokeStyle: datasets[0].backgroundColor[i],
                lineWidth: 0.5,
                hidden: !chart.getDataVisibility(i),
                index: i
              };
            });
          }
          return [];
        }
      }
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false
    },
    datalabels: {
      color: '#000',
      formatter: (value) => {
        return value > 0 ? value.toFixed() + '%' : '';
      },
      anchor: 'end',
      align: 'start',
      offset: 25
    }
  }
};

const _defaultGenderData = {
  labels: ['男', '女', '保密'],
  datasets: [
    {
      data: [0, 0, 0],
      backgroundColor: ['#8FACDF', '#DDCFAC', '#E09DA6'],
      hoverBackgroundColor: ['#8FACDF', '#DDCFAC', '#E09DA6']
    }
  ]
};

const _defaultAgeData = {
  labels: ['20 以下', '21~30', '31~40', '41~50', '51~60', '60 以上'],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: [
        '#F9C67F',
        '#8FACDF',
        '#DDCFAC',
        '#A3A0CD',
        '#E09DA6',
        '#9AB898'
      ],
      hoverBackgroundColor: [
        '#F9C67F',
        '#8FACDF',
        '#DDCFAC',
        '#A3A0CD',
        '#E09DA6',
        '#9AB898'
      ]
    }
  ]
};

/** 首頁  */
function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState(_defaultData);
  const [genderData, setGenderData] = useState(_defaultGenderData);
  const [ageData, setAgeData] = useState(_defaultAgeData);

  const methods = useForm({
    defaultValues: _defaultData
  });

  // 初始化
  useEffect(() => {
    try {
      (async () => {
        const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
        // 檢查使用者的首頁 跳轉頁面
        if (userInfo.homePage !== 'home') {
          navigate(homePageType[userInfo.homePage]);
        }
        const res = await api.auth.getDashboard();
        if (res) {
          setData(res);
          // 提取性別數據
          const genderCounts = [
            res.gender.male,
            res.gender.female,
            res.gender.other
          ];
          // 更新圓餅圖數據
          setGenderData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: genderCounts
              }
            ]
          }));
          // 提取年齡數據
          const ageCounts = [
            res.age['20'],
            res.age['21'],
            res.age['31'],
            res.age['41'],
            res.age['51'],
            res.age['60']
          ];
          // 更新圓餅圖數據
          setAgeData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: ageCounts
              }
            ]
          }));
        }
      })();
    } catch (error) {
      _EHS.errorReport(error, 'getDashboard', _EHS._LEVEL.ERROR);
    }
  }, [navigate]);

  const BubbleBox = ({ icon, title, value, valueColor }) => {
    return (
      <div className='bubble-box'>
        <div className='bubble-box__title'>
          {icon && <span className='icon'>{icon}</span>}
          <span>{title}</span>
        </div>
        <div className='bubble-box__value' style={{ color: valueColor }}>
          {value}
        </div>
      </div>
    );
  };

  const PieChartBox = ({ title, data }) => {
    return (
      <div className='pie-chart-box'>
        <div className='pie-chart-box__title'>{title}</div>
        <div className='pie-chart-box__content'>
          <Pie data={data} options={_chartOptions} />
        </div>
      </div>
    );
  };

  return (
    <div
      id='reward-list-94246de7-b6d6-43b1-8df8-62f845dd1571'
      className='mx-4 my-3'
    >
      <FormProvider {...methods}>
        <Form noValidate className='h-100'>
          <div className='mb-5'>
            <label className='form-label mb-3'>會員總數及籍別佔比</label>
            <Stack
              direction='horizontal'
              className='justify-content-center'
              gap={4}
            >
              <BubbleBox
                title='累積總會員數'
                icon={<PersonIcon color='#457FE4' size='24' />}
                value={insertComma(data.totalMember)}
                valueColor='#457FE4'
              />
              {data?.memberShip?.map((memberShip, index) => {
                const membershipIcon =
                  index < _defaultMemberShipList.length
                    ? _defaultMemberShipList[index].icon
                    : _defaultMemberShip.icon;
                const membershipColor =
                  index < _defaultMemberShipList.length
                    ? _defaultMemberShipList[index].valueColor
                    : _defaultMemberShip.valueColor;
                return (
                  <BubbleBox
                    key={index}
                    title={memberShip.rate}
                    icon={membershipIcon}
                    value={insertComma(memberShip.count)}
                    valueColor={membershipColor}
                  />
                );
              })}
            </Stack>
          </div>
          <div>
            <label className='form-label mb-3'>會員性別年齡分析</label>
            <Stack
              direction='horizontal'
              className='justify-content-center'
              gap={5}
            >
              <PieChartBox title='會員性別' data={genderData} />
              <PieChartBox title='會員年齡' data={ageData} />
            </Stack>
          </div>
        </Form>
      </FormProvider>
    </div>
  );
}

export default Home;
