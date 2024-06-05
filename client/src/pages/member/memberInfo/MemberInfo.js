import { useEffect, useState, createContext, useMemo } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import api from 'services/api';

import {
  TotalView,
  BasicInfo,
  ConsumptionRecord,
  BookingLog,
  PointLog,
  EcVoucherLog,
  Coupon,
  Giftcard,
  RewardCard,
  MemberShipLog
} from './sub_memberInfo';

import './memberInfoStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';
import Swal from 'sweetalert2';

const _EHS = new ExceptionHandleService({
  _NAME: 'page/member/memberInfo/memberInfo.js',
  _NOTICE: ''
});

export const MemberInfoContext = createContext();

/** 會員詳情 */
function MemberInfo() {
  const _tabs = [
    '總覽分析',
    '基本資料',
    '消費紀錄',
    '訂位資訊',
    '積點歷程',
    '電子票券',
    '優惠券',
    '商品券',
    '集點卡',
    '會籍歷程'
  ];
  const _panels = [
    <TotalView />,
    <BasicInfo />,
    <ConsumptionRecord />,
    <BookingLog />,
    <PointLog />,
    <EcVoucherLog />,
    <Coupon />,
    <Giftcard />,
    <RewardCard />,
    <MemberShipLog />
  ];
  const [currentTab, setCurrentTab] = useState(0);
  const [commonData, setCommonData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const memberId = useMemo(
    () => new URLSearchParams(location.search).get('id'),
    [location.search]
  );

  // 瀏覽或編輯
  useEffect(() => {
    // 無 id 導轉到會員列表
    if (!memberId) {
      navigate('/member/list');
      return;
    }
    setCurrentTab(location?.state?.panel ?? 0);
    // eslint-disable-next-line
  }, [memberId]);

  //取得會員共用資料
  useEffect(() => {
    if (!memberId) return;
    const getMemberCommonData = async () => {
      try {
        const data = await api.member.getMemberCommonData(memberId);
        if (data?.msg) {
          Swal.fire({
            icon: 'error',
            title: '查無此會員',
            confirmButtonText: '確定',
            confirmButtonColor: 'var(--bs-primary)'
          }).then(() => {
            navigate('/member/list');
          });
        } else {
          setCommonData(data);
        }
      } catch (error) {
        _EHS.errorReport(error, 'getMemberCommonData', _EHS._LEVEL.ERROR);
        return Promise.reject(error);
      }
    };
    getMemberCommonData();
    // eslint-disable-next-line
  }, [memberId]);

  const handleTabSelect = (idx) => {
    setCurrentTab(Number(idx));
  };

  if (!commonData) return null;
  return (
    <MemberInfoContext.Provider value={{ commonData, currentTab, memberId }}>
      <div id='member-info-96E3DF03-B172-4744-8655-30F1B472E040'>
        <Tab.Container
          defaultActiveKey='0'
          activeKey={currentTab}
          onSelect={handleTabSelect}
        >
          <Nav variant='underline' className='d-flex border-bottom mx-4'>
            {_tabs.map((item, index) => (
              <Nav.Item role='presentation' key={`tab-${index}`}>
                <Nav.Link eventKey={index}>{item}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content>
            {_panels.map((item, index) => (
              <Tab.Pane key={`panel-${index}`} eventKey={index}>
                {currentTab === index ? item : null}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </div>
    </MemberInfoContext.Provider>
  );
}

export default MemberInfo;
