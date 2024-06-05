import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { MemberInfoContext } from '../../MemberInfo';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
// import { useNavigate } from 'react-router-dom';

import api from 'services/api';
import ExceptionHandleService from 'utils/exceptionHandler';
import {
  rangeDate,
  formatDefTimeNew,
  formatStartEndDate
} from 'utils/timeUtils';
import { insertComma } from 'utils/commonUtil';

import BaseTable from 'features/table/baseTable/BaseTable';
import Info from '../0-component/Info';
import BillBoard from '../0-component/billBoard';

import TextField from 'features/textField/TextField';
import { Form, Button, Overlay, Popover } from 'react-bootstrap';
import PermissionAction from 'components/permissionAction/PermissionAction';
import AUTH_CODE from 'config/auth.code.config';

const _EHS = new ExceptionHandleService({
  _NAME: 'page/member/memberInfo/sub_memberInfo/9-rewardCard/RewardCard.js',
  _NOTICE: ''
});

const _mapBillBoardStr = {
  rewardPointIngCount: '集點中',
  rewardPointFullCount: '已集滿',
  rewardPointExpirationCount: '已到期'
};
const _defaultValues = {
  brandId: '',
  date: '90'
};

/** 會員詳情 - 集點卡 */
function RewardCard() {
  // const navigate = useNavigate();
  const { commonData, memberId } = useContext(MemberInfoContext);
  const [list, setList] = useState([]);
  const customDateRef = useRef(null);
  const [showCustomDatePopover, setShowCustomDatePopover] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [billBoardData, setBillBoardData] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]); // 品牌下拉式選項
  const [pageMeta, setPageMeta] = useState({
    totalCount: 0, //總筆數
    totalPage: 0, // 總頁數
    perPage: 20, // 每頁筆數
    page: 1 //當前頁數
  });

  // 取得品牌下拉式選單
  useEffect(() => {
    let ignore = true;
    const getOptions = async () => {
      const [_brandData] = await Promise.all([api.brand.getBrandMenu()]);
      if (ignore) {
        const _bOptions = _brandData?.map(({ brandId, brandName }) => ({
          label: brandName,
          value: brandId
        }));
        setBrandOptions(_bOptions);
      }
    };
    getOptions();
    return () => (ignore = false);
  }, []);

  /* table config */
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('brandName', {
      header: '品牌'
    }),
    columnHelper.accessor('rewardCardName', {
      header: '集點卡'
    }),
    columnHelper.accessor('state', {
      header: '狀態'
    }),
    columnHelper.accessor('transactionType', {
      header: '項目'
    }),
    columnHelper.accessor('point', {
      header: '點數',
      cell: (info) => {
        const isNegative = info.getValue() < 0;
        const val = insertComma(info.getValue());
        return <span className={isNegative ? 'text-danger' : ''}>{val}</span>;
      }
    }),
    columnHelper.accessor('lastMaxPoint', {
      header: '累計/滿點點數'
    }),
    columnHelper.accessor('sendCardDate', {
      header: '發卡日'
    }),
    columnHelper.accessor('alterDate', {
      header: '異動日'
    }),
    columnHelper.accessor('expirationDate', {
      header: '到期日'
    }),
    columnHelper.accessor('transactionId', {
      header: '交易序號'
    })
  ];
  const table = useReactTable({
    data: list,
    enableSorting: false,
    getRowId: (row) => row?.transactionId,
    getCoreRowModel: getCoreRowModel(),
    columns
  });

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: _defaultValues
  });

  const dateRangeWatch = methods.watch('date');

  /* 偵測註冊radio變換，更換 datepicker 值*/
  useEffect(() => {
    const setFormattedDate = (key, date, isStart) => {
      methods.setValue(
        key,
        formatDefTimeNew(date, {
          isStart: isStart,
          formatString: 'yyyy/MM/dd HH:mm:ss'
        })
      );
    };
    switch (dateRangeWatch) {
      case '90':
      case '180':
      case '365':
        const days =
          dateRangeWatch === '90'
            ? -90
            : dateRangeWatch === '180'
            ? -180
            : -365;
        setFormattedDate('startDate', rangeDate(days), true);
        setFormattedDate('endDate', new Date(), false);
        break;
      case 'custom':
        setFormattedDate('startDate', new Date(), true);
        setFormattedDate('endDate', new Date(), false);
        break;
      default:
        methods.setValue('startDate', '');
        methods.setValue('endDate', '');
    }
  }, [dateRangeWatch, methods]);

  const getList = useCallback(async (reqBody) => {
    try {
      const res = await api.rewardCard.getMemberRewardDetail(reqBody);
      if (res) {
        const { metaData, memberRewardDetail, ...rest } = res;
        setPageMeta(metaData);
        const formatItem = (item) => {
          const _sendCardDate = item?.sendCardDate
            ? formatDefTimeNew(item?.sendCardDate, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '-';
          const _alterDate = item?.alterDate
            ? formatDefTimeNew(item?.alterDate, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '-';
          const _expirationDate = item?.expirationDate
            ? formatDefTimeNew(item?.expirationDate, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '-';
          const _state = Object.freeze({
            1: '集點中',
            2: '已集滿',
            3: '已到期'
          });
          const _transactionType = Object.freeze({
            1: '滿點自動兌換',
            2: '消費回饋',
            3: '退貨返點',
            4: '調整集點',
            5: '集點過期',
            6: '點數轉移'
          });

          return {
            brandName: item?.brandName || '--',
            rewardCardName: item?.rewardCardName || '--',
            state: item?.state ? _state[Number(item?.state)] : '--',
            transactionType: item?.transactionType
              ? _transactionType[Number(item?.transactionType)]
              : '--',
            point: insertComma(item?.point) ?? '--',
            lastMaxPoint:
              item?.lastPoint != null && item?.maxPoint != null
                ? `${insertComma(item?.lastPoint)}/${insertComma(
                    item?.maxPoint
                  )}`
                : '--',
            sendCardDate: _sendCardDate,
            alterDate: _alterDate,
            expirationDate: _expirationDate,
            transactionId: item?.transactionId || '--'
          };
        };
        const formattedList = memberRewardDetail?.map(formatItem);
        setList(formattedList);
        const _data = Object.entries(rest).map(([key, value]) => ({
          text: _mapBillBoardStr[key],
          number: insertComma(value)
        }));
        setBillBoardData(_data);
      }
    } catch (error) {
      _EHS.errorReport(error, 'getList', _EHS._LEVEL.ERROR);
    }
  }, []);

  // 預設清單
  useEffect(() => {
    let ignore = true;
    const reqBody = {
      memberId,
      brandId: '',
      startDate: formatStartEndDate(methods.getValues('startDate'), true),
      endDate: formatStartEndDate(methods.getValues('endDate'), false),
      page: 1,
      perPage: 20
    };
    if (memberId && ignore) getList(reqBody);
    return () => (ignore = false);
  }, [memberId, methods, getList]);

  /* table 換頁數切換 */
  const handlePageFetch = (page) => {
    const additionalParams = {
      page,
      perPage: pageMeta.perPage
    };
    fetchListWithCurrentValues(additionalParams);
  };

  const handleCountFetch = (count) => {
    table.setPageSize(Number(count));
    const additionalParams = {
      page: pageMeta.page,
      perPage: count
    };
    fetchListWithCurrentValues(additionalParams);
  };

  /* 選擇下拉式就打api取得清單 */
  const handleSelect = (name, selectedValue, isCustomDateRange = false) => {
    // 更新表單的值
    methods.setValue(name, selectedValue);
    if (name === 'date') {
      const setFormattedDate = (key, date, isStart) => {
        methods.setValue(
          key,
          formatDefTimeNew(date, {
            isStart: isStart,
            formatString: 'yyyy/MM/dd HH:mm:ss'
          })
        );
      };
      switch (selectedValue) {
        case '90':
        case '180':
        case '365':
          const days =
            selectedValue === '90'
              ? -90
              : selectedValue === '180'
              ? -180
              : -365;
          setFormattedDate('startDate', rangeDate(days), true);
          setFormattedDate('endDate', new Date(), false);
          setShowCustomDatePopover(false);
          break;
        case 'custom':
          setShowCustomDatePopover(!isCustomDateRange);
          if (isCustomDateRange) {
            break;
          } else {
            return;
          }
        default:
          methods.setValue('startDate', '');
          methods.setValue('endDate', '');
          setShowCustomDatePopover(false);
      }
    }
    const additionalParams = {
      page: pageMeta.page,
      perPage: pageMeta.perPage
    };
    fetchListWithCurrentValues(additionalParams);
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  const handleDateDropdownClick = () => {
    if (dateRangeWatch === 'custom') {
      setShowCustomDatePopover(true); // 如果當前選項已是自訂區間，則顯示氣泡框
    }
  };

  // 根據當前表單值和額外的參數獲取列表
  const fetchListWithCurrentValues = (additionalParams = {}) => {
    const data = methods.getValues();
    const reqBody = {
      memberId,
      brandId: data.brandId,
      startDate: formatStartEndDate(methods.getValues('startDate'), true),
      endDate: formatStartEndDate(methods.getValues('endDate'), false),
      ...additionalParams // 將額外參數融合進 reqBody
    };
    getList(reqBody);
  };

  /* 前往集點卡調整頁面 */
  const handleRewardCardAdjustInfo = () => {
    // URL 中，+ 號通常被解釋為空格 ( ) 的編碼
    const icp = commonData.mobileCountryCode.replace('+', ''); // 移除 + 號
    const mobile = commonData.mobile;
    const url = `/rewardCard/adjustmentlist/setting?&mode=add&icp=${icp}&mobile=${mobile}`;
    // 在新分頁中打開 URL
    window.open(url, '_blank');
    // navigate(
    //   `/rewardCard/adjustmentlist/setting?&mode=add&icp=${icp}&mobile=${mobile}`
    // );
  };

  return (
    <FormProvider {...methods}>
      <div className='mx-4'>
        <Form noValidate onSubmit={methods.handleSubmit(handleSubmit)}>
          {/* 會員資訊共用區塊 */}
          <Info
            name={commonData?.name}
            mobile={`${commonData?.mobileCountryCode}-${commonData?.mobile}`}
            chips={[commonData?.membershipStatus, commonData?.specialTypeName]}
          >
            <TextField
              name='brandId'
              variant='select'
              options={brandOptions}
              placeholder='全部品牌'
              callBackFn={handleSelect}
            />
            <div ref={customDateRef} onClick={handleDateDropdownClick}>
              <TextField
                name='date'
                variant='select'
                isPlaceholder={false}
                callBackFn={handleSelect}
                options={[
                  { label: '近三個月', value: '90' },
                  { label: '近六個月', value: '180' },
                  { label: '近一年', value: '365' },
                  { label: '自訂區間', value: 'custom' }
                ]}
              />
            </div>
            <Overlay
              show={showCustomDatePopover}
              target={customDateRef.current}
              placement='bottom'
              rootClose
              rootCloseEvent='click'
              onHide={() => {
                if (!isDatePickerOpen) {
                  setShowCustomDatePopover(false);
                }
              }}
            >
              <Popover id='tooltip-example' style={{ maxWidth: '100%' }}>
                <Popover.Body>
                  <div className='d-flex align-items-center'>
                    <TextField
                      variant='datePicker'
                      name='startDate'
                      isStart
                      fieldWidth='155px'
                      label=''
                      dateOptions={{
                        maxDate: methods.watch('endDate'),
                        minDate: formatDefTimeNew(
                          new Date(
                            new Date().setFullYear(new Date().getFullYear() - 3)
                          ),
                          {
                            isStart: true,
                            formatString: 'yyyy/MM/dd HH:mm:ss'
                          }
                        ) // 三年前的日期作為最小可選日期
                      }}
                      onCalendarOpen={() => setIsDatePickerOpen(true)}
                      onCalendarClose={() => setIsDatePickerOpen(false)}
                    />
                    <span className='px-3 pb-2'>~</span>
                    <TextField
                      variant='datePicker'
                      name='endDate'
                      fieldWidth='155px'
                      isEnd
                      label=''
                      dateOptions={{
                        minDate: methods.watch('startDate'),
                        maxDate: new Date() // 今天作為 endDate 的最大可選日期
                      }}
                      onCalendarOpen={() => setIsDatePickerOpen(true)}
                      onCalendarClose={() => setIsDatePickerOpen(false)}
                    />
                  </div>
                  <div className='d-flex justify-content-center mt-2'>
                    <Button
                      type='button'
                      size='sm'
                      onClick={() => handleSelect('date', 'custom', true)}
                    >
                      確定
                    </Button>
                  </div>
                </Popover.Body>
              </Popover>
            </Overlay>
            <PermissionAction authCode={AUTH_CODE.CARD.ADJUST.CREATE_UPDATE}>
              <Button
                className='text-nowrap'
                variant='outline-info'
                size='sm'
                onClick={handleRewardCardAdjustInfo}
              >
                集點調整
              </Button>
            </PermissionAction>
          </Info>
          {/* 顯示區塊 */}
          <BillBoard data={billBoardData} />
          {/* Table */}
          <BaseTable
            table={table}
            totalCounts={pageMeta.totalCount}
            totalPages={pageMeta.totalPage}
            currentPage={pageMeta.page}
            isDefaultEmpty={false}
            handlePageFetch={handlePageFetch}
            handleCountFetch={handleCountFetch}
          />
        </Form>
      </div>
    </FormProvider>
  );
}

export default RewardCard;
