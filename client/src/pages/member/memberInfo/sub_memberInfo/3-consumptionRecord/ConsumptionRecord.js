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
import transactionType from 'constants/transactionType';
import { insertComma } from 'utils/commonUtil';

import BaseTable from 'features/table/baseTable/BaseTable';
import Info from '../0-component/Info';
import BillBoard from '../0-component/billBoard';

import TextField from 'features/textField/TextField';
import { Form, Button, Overlay, Popover } from 'react-bootstrap';
import { Actions } from 'components/table/Table';
// import OrderDetailModal from '../../../../coupon/sub_coupon/orderDetailModal/OrderDetailModal';

const _EHS = new ExceptionHandleService({
  _NAME:
    'page/member/memberInfo/sub_memberInfo/3-consumptionRecord/ConsumptionRecord.js',
  _NOTICE: ''
});

const _mapBillBoardStr = {
  payAmount: '年度消費金額',
  payCount: '年度消費次數',
  refundAmount: '年度退款金額',
  refundCount: '年度退款次數'
};
const _defaultValues = {
  channelId: '',
  transactionType: '',
  brandId: '',
  date: '90'
};

/** 會員詳情 - 消費紀錄 */
function ConsumptionRecord() {
  const { commonData, memberId } = useContext(MemberInfoContext);
  const [list, setList] = useState([]);
  const customDateRef = useRef(null);
  const [showCustomDatePopover, setShowCustomDatePopover] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [billBoardData, setBillBoardData] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]); // 品牌下拉式選項
  const [channelOptions, setChannelOptions] = useState([]); // 渠道下拉式選項
  const transactionOptions = Object.entries(transactionType).map(
    ([key, value]) => ({ value: key, label: value })
  ); // 交易類型下拉式選項
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
      header: '來源'
    }),
    columnHelper.accessor('brandName', {
      header: '品牌'
    }),
    columnHelper.accessor('storeName', {
      header: '門市名稱'
    }),
    columnHelper.accessor('transactionType', {
      header: '類型'
    }),
    columnHelper.accessor('amount', {
      header: '交易金額',
      cell: (info) => {
        const isReturn =
          info?.row?.original?.transactionType === transactionType.RETURN;
        const val = insertComma(info.getValue());
        return !isReturn ? (
          <span>${val}</span>
        ) : (
          <span className='text-danger'>-${val}</span>
        );
      }
    }),
    columnHelper.accessor('transactionTime', {
      header: '交易時間',
      cell: (info) => {
        return formatDefTimeNew(info.getValue(), {
          formatString: 'yyyy/MM/dd HH:mm'
        });
      }
    }),
    columnHelper.accessor('transactionCode', {
      header: '交易序號'
    }),
    columnHelper.accessor('invoiceNumber', {
      header: '發票號碼',
      cell: (info) => {
        return (
          <>
            <p>{info.getValue()}</p>
            <Actions>
              <Actions.View
                onClick={() => {
                  setSelectedId(info?.row?.original?.transactionCode);
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
      const res = await api.order.getMemberOrderLog(reqBody);
      if (res) {
        const { metaData, orderList, ...rest } = res;
        setPageMeta(metaData);
        const formatOrderItem = (item) => {
          return {
            channelName: item?.channelName || '--',
            brandName: item?.brandName || '--',
            storeName: item?.storeName || '--',
            transactionType: transactionType[item?.transactionType] || '--',
            transactionTime: item?.transactionTime || '--',
            transactionCode: item?.transactionId || '--',
            invoiceNumber: item?.invoiceNumber || '--',
            amount: item?.paidAmount ?? '--'
          };
        };
        const formattedOrderList = orderList?.map(formatOrderItem);
        setList(formattedOrderList);
        const formatAmount = (key, value) => {
          if (['payAmount', 'refundAmount'].includes(key)) {
            const formattedValue = insertComma(Number(value));
            return `$${formattedValue}`;
          }
          return value;
        };
        const _data = Object.entries(rest).map(([key, value]) => ({
          text: _mapBillBoardStr[key],
          number: formatAmount(key, value)
        }));
        setBillBoardData(_data);
      }
    } catch (error) {
      _EHS.errorReport(error, 'getMemberOrderLog', _EHS._LEVEL.ERROR);
    }
  }, []);

  // 預設清單
  useEffect(() => {
    let ignore = true;
    const reqBody = {
      memberId,
      channelId: '',
      brandId: '',
      transactionType: '',
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
      channelId: data.channelId,
      brandId: data.brandId,
      transactionType: data.transactionType,
      startDate: formatStartEndDate(methods.getValues('startDate', true)),
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
      channelId: data.channelId,
      brandId: data.brandId,
      transactionType: data.transactionType,
      startDate: formatStartEndDate(methods.getValues('startDate', true)),
      endDate: formatStartEndDate(methods.getValues('endDate', false)),
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
      channelId: data.channelId,
      brandId: data.brandId,
      transactionType: data.transactionType,
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
              name='channelId'
              variant='select'
              options={channelOptions}
              placeholder='訂單來源'
              callBackFn={handleSelect}
            />
            <TextField
              name='transactionType'
              variant='select'
              options={transactionOptions}
              placeholder='交易類型'
              callBackFn={handleSelect}
            />
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
            // <OrderDetailModal
            //   show={showModal}
            //   setShow={setShowModal}
            //   transactionId={selectedId}
            // />
            <div />
          )}
        </Form>
      </div>
    </FormProvider>
  );
}

export default ConsumptionRecord;
