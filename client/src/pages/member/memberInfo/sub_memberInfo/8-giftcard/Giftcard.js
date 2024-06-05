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
import couponRule from 'constants/couponRule';

import TextField from 'features/textField/TextField';
import { Form, Button, Overlay, Popover } from 'react-bootstrap';
import { Actions } from 'components/table/Table';
import PermissionAction from 'components/permissionAction/PermissionAction';
import AUTH_CODE from 'config/auth.code.config';
import alertService from 'utils/alertService';

const _EHS = new ExceptionHandleService({
  _NAME: 'page/member/memberInfo/sub_memberInfo/8-giftcard/Giftcard.js',
  _NOTICE: ''
});

const _mapBillBoardStr = {
  validCount: '待核銷',
  redeemedCount: '已核銷',
  expiredCount: '已到期',
  transferredCount: '已轉贈',
  returnedCount: '已退貨'
};
const _defaultValues = {
  channelId: '',
  rewardRule: '',
  brandId: '',
  state: '0',
  date: '90'
};

const _couponRuleOptions = Object.entries(couponRule).map(([key, value]) => ({
  value: `${key}`,
  label: value
}));

// 狀態下拉式選單選項
const _stateOptions = [
  { value: '0', label: '狀態' },
  { value: '1', label: '可使用' },
  { value: '2', label: '已核銷' },
  { value: '3', label: '已到期' },
  { value: '4', label: '已轉贈' },
  { value: '5', label: '已退貨' }
];

const _defaultCouponType = 2; // 1: 優惠券; 2: 商品券

// 發放規則下拉式選單選項 商品券無4~7項
const currentOptions = _couponRuleOptions.slice(0, 3);

/** 會員詳情 - 商品券 */
function Giftcard() {
  // const navigate = useNavigate();
  const { commonData, memberId } = useContext(MemberInfoContext);
  const [list, setList] = useState([]);
  const customDateRef = useRef(null);
  const [showCustomDatePopover, setShowCustomDatePopover] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [billBoardData, setBillBoardData] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]); // 品牌下拉式選項
  const [channelOptions, setChannelOptions] = useState([]); // 渠道下拉式選項
  const [pageMeta, setPageMeta] = useState({
    totalCount: 0, //總筆數
    totalPage: 0, // 總頁數
    perPage: 20, // 每頁筆數
    page: 1 //當前頁數
  });

  // 取得渠道/品牌下拉式選單
  useEffect(() => {
    let ignore = true;
    const getOptions = async () => {
      const [_channelData, _brandData] = await Promise.all([
        api.channel.getChannelMenu(),
        api.brand.getBrandMenu()
      ]);
      if (ignore) {
        const _cOptions = _channelData?.list?.map(({ id, name }) => ({
          label: name,
          value: id
        }));
        const _bOptions = _brandData?.map(({ brandId, brandName }) => ({
          label: brandName,
          value: brandId
        }));
        setChannelOptions(_cOptions);
        setBrandOptions(_bOptions);
      }
    };
    getOptions();
    return () => (ignore = false);
  }, []);

  /* table config */
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('channelName', {
      header: '渠道'
    }),
    columnHelper.accessor('rewardRule', {
      header: '發放規則'
    }),
    columnHelper.accessor('brandNames', {
      header: '品牌'
    }),
    columnHelper.accessor('couponName', {
      header: '商品券'
    }),
    columnHelper.accessor('transactionType', {
      header: '狀態'
    }),
    columnHelper.accessor('point', {
      header: '兌換積點'
    }),
    columnHelper.accessor('reward', {
      header: '兌換集點'
    }),
    columnHelper.accessor('transactionDate', {
      header: '交易日 '
    }),
    columnHelper.accessor('couponEndDate', {
      header: '到期日'
    }),
    columnHelper.accessor('writeOffDate', {
      header: '核銷日'
    }),
    columnHelper.accessor('transferDate', {
      header: '轉贈日'
    }),
    columnHelper.accessor('returnDate', {
      header: '退貨日'
    }),
    columnHelper.accessor('writeOffStoreName', {
      header: '核銷門市'
    }),
    columnHelper.accessor('transactionId', {
      header: '交易序號'
    }),
    columnHelper.accessor('transferMemberCardId', {
      header: '受贈人',
      enableSorting: false,
      cell: (info) => {
        const rewardRule = info?.row?.original?.rewardRule;
        const returnDate = info?.row?.original?.returnDate;
        const transferDate = info?.row?.original?.transferDate;
        const transferMemberCardId = info?.row?.original?.transferMemberCardId;
        const transactionType = info?.row?.original?.transactionType;
        const id = info?.row?.original?.transactionId;
        const isReturned = returnDate !== '--';
        const isTransferred =
          transferDate !== '--' || transferMemberCardId !== '--';
        const name = info?.row?.original?.couponName;
        return (
          <>
            {info.getValue()}{' '}
            <Actions>
              <PermissionAction
                authCode={
                  _defaultCouponType === 1
                    ? AUTH_CODE.TRANSACTION.COUPON_DETAIL.PAGE
                    : AUTH_CODE.TRANSACTION.ITEM_EXCHANGE_DETAIL.PAGE
                }
              >
                {!isTransferred &&
                  !isReturned &&
                  transactionType === '可使用' &&
                  (rewardRule === '普通兌換' ||
                    rewardRule === '集點卡兌換') && (
                    <Actions.Delete
                      onClick={() => handleDelSetting(id, name)}
                    />
                  )}
              </PermissionAction>
            </Actions>
          </>
        );
      }
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
      const res = await api.coupon.getMemberCouponDetailList(reqBody);
      if (res) {
        const { metaData, memberCouponList, couponStatusCount } = res;
        setPageMeta(metaData);
        const formatItem = (item) => {
          const _transactionDate = item?.transactionDate
            ? formatDefTimeNew(item?.transactionDate, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '--';
          const _couponEndDate = item?.couponEndDate
            ? formatDefTimeNew(item?.couponEndDate, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '--';
          const _writeOffDate = item?.writeOffDate
            ? formatDefTimeNew(item?.writeOffDate, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '--';
          const _transferDate = item?.transferDate
            ? formatDefTimeNew(item?.transferDate, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '--';
          const _returnDate = item?.returnDate
            ? formatDefTimeNew(item?.returnDate, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '--';
          return {
            couponId: item?.couponId || '--',
            channelName: item?.channelName || '--',
            rewardRule: item?.rewardRule
              ? couponRule[Number(item?.rewardRule)]
              : '--',
            brandNames:
              item?.brandNames && item?.brandNames.length > 0
                ? item.brandNames.join('、')
                : '--',
            couponName: item?.couponName || '--',
            transactionType: item?.transactionType
              ? _stateOptions.find(
                  (opt) => opt.value === String(item?.transactionType)
                )?.label
              : '--',
            point: insertComma(item?.point) || '--',
            reward: insertComma(item?.reward) || '--',
            transactionDate: _transactionDate,
            couponEndDate: _couponEndDate,
            writeOffDate: _writeOffDate,
            transferDate: _transferDate,
            returnDate: _returnDate,
            writeOffStoreName: item?.writeOffStoreName || '--',
            transactionId: item?.transactionId || '--',
            transferMemberCardId: item?.transferMemberCardId || '--'
          };
        };
        const formattedList = memberCouponList?.map(formatItem);
        setList(formattedList);
        const _data = Object.entries(couponStatusCount).map(([key, value]) => ({
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
      couponType: _defaultCouponType,
      channelId: '',
      rewardRule: 0,
      brandId: '',
      state: '0',
      transactionStartDate: formatStartEndDate(
        methods.getValues('startDate'),
        true
      ),
      transactionEndDate: formatStartEndDate(
        methods.getValues('endDate'),
        false
      ),
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

  // 披著刪除皮的退貨
  async function handleDelSetting(id, name) {
    const alertRes = await alertService.confirm({ text: `確定退貨 ${name}？` });
    if (!alertRes.isConfirmed) return;
    const res = await api.coupon.refundCouponDetail({
      transactionId: id
    });
    if (res) {
      alertService.toast({ title: '退貨成功' });
      const additionalParams = {
        page: pageMeta.page,
        perPage: pageMeta.perPage
      };
      fetchListWithCurrentValues(additionalParams);
    }
  }

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
      couponType: _defaultCouponType,
      channelId: data.channelId,
      rewardRule: Number(data.rewardRule) || 0,
      brandId: data.brandId,
      state: data.state,
      transactionStartDate: formatStartEndDate(
        methods.getValues('startDate'),
        true
      ),
      transactionEndDate: formatStartEndDate(
        methods.getValues('endDate'),
        false
      ),
      ...additionalParams // 將額外參數融合進 reqBody
    };
    getList(reqBody);
  };

  /* 前往兌換券發放新增頁面 */
  const handleCouponSendDetail = () => {
    // URL 中，+ 號通常被解釋為空格 ( ) 的編碼
    const icp = commonData.mobileCountryCode.replace('+', ''); // 移除 + 號
    const mobile = commonData.mobile;
    const baseUrl = `/coupon/couponsendinglist/`;
    const urlSuffix =
      _defaultCouponType === 1
        ? `coupon?&mode=add&icp=${icp}&mobile=${mobile}`
        : `giftcard?&mode=add&icp=${icp}&mobile=${mobile}`;
    // 在新分頁中打開 URL
    window.open(baseUrl + urlSuffix, '_blank');
    // _defaultCouponType === 1
    //   ? navigate(
    //       `/coupon/couponsendinglist/coupon?&mode=add&icp=${icp}&mobile=${mobile}`
    //     )
    //   : navigate(
    //       `/coupon/couponsendinglist/giftcard?&mode=add&icp=${icp}&mobile=${mobile}`
    //     );
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
              name='channelId'
              variant='select'
              options={channelOptions}
              placeholder='全部渠道'
              callBackFn={handleSelect}
            />
            <TextField
              name='rewardRule'
              variant='select'
              options={currentOptions}
              placeholder='發放規則'
              callBackFn={handleSelect}
            />
            <TextField
              name='brandId'
              variant='select'
              options={brandOptions}
              placeholder='全部品牌'
              callBackFn={handleSelect}
            />
            <TextField
              name='state'
              variant='select'
              options={_stateOptions}
              isPlaceholder={false}
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
            <PermissionAction
              authCode={AUTH_CODE.EXCHANGE.COUPON_ITEM_ISSUE.CREATE_UPDATE}
            >
              <Button
                className='text-nowrap'
                variant='outline-info'
                size='sm'
                onClick={handleCouponSendDetail}
              >
                商品券發放
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

export default Giftcard;
