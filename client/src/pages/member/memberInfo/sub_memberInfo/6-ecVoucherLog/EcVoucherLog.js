import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { MemberInfoContext } from '../../MemberInfo';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

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
import { Actions } from 'components/table/Table';
// import EcVoucherInfoModal from '../../../../coupon/sub_coupon/ecVoucherInfoModal/EcVoucherInfoModal';

const _EHS = new ExceptionHandleService({
  _NAME: 'page/member/memberInfo/sub_memberInfo/6-ecVoucherLog/EcVoucherLog.js',
  _NOTICE: ''
});

// 狀態下拉式選單選項
const _stateOptions = [
  { value: '', label: '狀態' },
  { value: 'canUse', label: '可使用' },
  { value: 'isWriteOff', label: '已核銷' },
  { value: 'isExpired', label: '已到期' },
  { value: 'isTransfer', label: '已轉贈' },
  { value: 'isReturn', label: '已退貨' }
];

const _defaultValues = {
  brandId: '',
  state: '',
  date: '90'
};

/** 會員詳情 - 電子票券 */
function EcVoucherLog() {
  const { commonData, memberId } = useContext(MemberInfoContext);
  const [list, setList] = useState([]);
  const customDateRef = useRef(null);
  const [showCustomDatePopover, setShowCustomDatePopover] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [billBoardData, setBillBoardData] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]); // 品牌下拉式選項

  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
    columnHelper.accessor('voucherName', {
      header: '票券名稱'
    }),
    columnHelper.accessor('amount', {
      header: '交易金額'
    }),
    columnHelper.accessor('tradeDate', {
      header: '交易日',
      cell: (info) => {
        return formatDefTimeNew(info.getValue(), {
          formatString: 'yyyy/MM/dd HH:mm'
        });
      }
    }),
    columnHelper.accessor('expireDate', {
      header: '到期日',
      cell: (info) => {
        return formatDefTimeNew(info.getValue(), {
          formatString: 'yyyy/MM/dd HH:mm'
        });
      }
    }),
    columnHelper.accessor('tradeNo', {
      header: '交易序號'
    }),
    columnHelper.accessor('canUseCount', {
      header: '可使用',
      size: 80
    }),
    columnHelper.accessor('writeOffCount', {
      header: '已核銷',
      size: 80
    }),
    columnHelper.accessor('expiredCount', {
      header: '已到期',
      size: 80
    }),
    columnHelper.accessor('transferCount', {
      header: '已轉贈',
      size: 80
    }),
    columnHelper.accessor('returnCount', {
      header: '已退貨',
      size: 80,
      cell: (info) => {
        return (
          <>
            <p>{info.getValue()}</p>
            <Actions>
              <Actions.View
                onClick={() => {
                  setSelectedId(info?.row?.original?.id);
                  setShowModal(true);
                }}
              />
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
      const res = await api.member.getMemberEcVoucherLog(reqBody);
      if (res) {
        const { metaData, logList, billInfo } = res;
        setPageMeta(metaData);
        const formatOrderItem = (item) => {
          return {
            id: item?.id,
            brandName: item?.brandName || '--',
            voucherName: item?.voucherName || '--',
            amount: item?.amount || '--',
            tradeDate: item?.tradeDate || '--',
            expireDate: item?.expireDate || '--',
            tradeNo: item?.tradeNo || '--',
            canUseCount: item?.canUseCount
              ? insertComma(Number(item?.canUseCount))
              : 0,
            writeOffCount: item?.writeOffCount
              ? insertComma(Number(item?.writeOffCount))
              : 0,
            expiredCount: item?.expiredCount
              ? insertComma(Number(item?.expiredCount))
              : 0,
            transferCount: item?.transferCount
              ? insertComma(Number(item?.transferCount))
              : 0,
            returnCount: item?.returnCount
              ? insertComma(Number(item?.returnCount))
              : 0
          };
        };
        const formattedLogList = logList?.map(formatOrderItem);
        setList(formattedLogList);
        const _data = billInfo.map((item) => ({
          ...item,
          number: insertComma(Number(item.number))
        }));
        setBillBoardData(_data);
      }
    } catch (error) {
      _EHS.errorReport(error, 'getMemberEcVoucherLog', _EHS._LEVEL.ERROR);
    }
  }, []);

  // 預設清單
  useEffect(() => {
    let ignore = true;
    const reqBody = {
      memberId,
      state: '',
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
    const data = methods.getValues();
    const reqBody = {
      memberId,
      state: data.state,
      brandId: data.brandId,
      startDate: formatStartEndDate(methods.getValues('startDate'), true),
      endDate: formatStartEndDate(methods.getValues('endDate'), false),
      page,
      perPage: pageMeta.perPage
    };
    getList(reqBody);
  };
  const handleCountFetch = (count) => {
    table.setPageSize(Number(count));
    const data = methods.getValues();
    const reqBody = {
      memberId,
      state: data.state,
      brandId: data.brandId,
      startDate: formatStartEndDate(methods.getValues('startDate'), true),
      endDate: formatStartEndDate(methods.getValues('endDate'), false),
      page: pageMeta.page,
      perPage: count
    };
    getList(reqBody);
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
    const data = methods.getValues();
    const reqBody = {
      memberId,
      state: data.state,
      brandId: data.brandId,
      startDate: formatStartEndDate(methods.getValues('startDate', true)),
      endDate: formatStartEndDate(methods.getValues('endDate', false)),
      page: pageMeta.page,
      perPage: pageMeta.perPage
    };
    getList(reqBody);
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  const handleDateDropdownClick = () => {
    if (dateRangeWatch === 'custom') {
      setShowCustomDatePopover(true); // 如果當前選項已是自訂區間，則顯示氣泡框
    }
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
          {showModal && (
            // <EcVoucherInfoModal
            //   show={showModal}
            //   setShow={setShowModal}
            //   id={selectedId}
            // />
            <div />
          )}
        </Form>
      </div>
    </FormProvider>
  );
}

export default EcVoucherLog;
