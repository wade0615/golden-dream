import { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Modal, Form, Stack } from 'react-bootstrap';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table';

import api from 'services/api';
import { formatDefTimeNew, formatStartEndDate } from 'utils/timeUtils';

import SearchBar from 'components/searchBar/SearchBar';
import AdvanceSection from 'components/advanceSection/AdvanceSection';
import IndeterminateCheckbox from 'components/indeterminateCheckbox/IndeterminateCheckbox';
import TextField, { FieldGroup } from 'features/textField/TextField';
import BaseTable from 'features/table/baseTable/BaseTable';

import './modalStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';
const _EHS = new ExceptionHandleService({
  _NAME:
    'features/grouping/groupingOrganisms/typeMolecules/sub_typeMolecules/pointModal',
  _NOTICE: ''
});

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor('checkbox', {
    header: ({ table }) => (
      <>
        <IndeterminateCheckbox
          name='checkbox-all'
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      </>
    ),
    cell: ({ row }) => (
      <div className='w-100'>
        <IndeterminateCheckbox
          name={crypto.randomUUID()}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </div>
    )
  }),
  columnHelper.accessor('name', {
    header: '活動名稱'
  }),
  columnHelper.accessor('typeStr', {
    header: '活動類型'
  }),
  columnHelper.accessor('date', {
    header: '活動時間'
  })
];

const _defaultValue = {
  search: '',
  searchType: 'reward_name', //reward_name: 活動名稱
  brandId: '',
  activityType: '',
  activityDate: '',
  startDate: '',
  endDate: ''
};

function PointModal({
  show = false,
  setShow = (f) => f,
  title = '積點發放活動設定',
  onAdd = (f) => f,
  excludePointRewardIds = [],
  setExcludePointRewardIds = (f) => f
}) {
  const [brandOptions, setBrandOptions] = useState([]);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]); //data

  const [pageMeta, setPageMeta] = useState({
    //setPageMeta
    totalCount: 0, //總筆數
    totalPage: 0, // 總頁數
    perPage: 20, // 每頁筆數
    page: 1 //當前頁數
  });
  const modalMethods = useForm({
    defaultValues: _defaultValue
  });
  const activityDateWatch = modalMethods.watch('activityDate');

  /* helper function */
  const RangeDate = (dayCounts, startDate = new Date()) =>
    new Date(new Date().setDate(startDate.getDate() + Number(dayCounts)));

  /* 偵測註冊radio變換，更換 datepicker 值*/
  useEffect(() => {
    const setFormattedDate = (key, date, isStart) => {
      modalMethods.setValue(
        key,
        formatDefTimeNew(date, {
          isStart: isStart,
          formatString: 'yyyy/MM/dd HH:mm:ss'
        })
      );
    };
    switch (activityDateWatch) {
      case '30':
      case '90':
        const dayCount = activityDateWatch === '30' ? -30 : -90;
        setFormattedDate('startDate', RangeDate(dayCount), true);
        setFormattedDate('endDate', new Date(), false);
        break;
      case 'custom':
        setFormattedDate('startDate', new Date(), true);
        setFormattedDate('endDate', new Date(), false);
        break;
      default:
        modalMethods.setValue('startDate', '');
        modalMethods.setValue('endDate', '');
    }
  }, [activityDateWatch, modalMethods]);

  const table = useReactTable({
    data: data,
    columns: columns,
    getRowId: (row) => row?.id,
    initialState: {
      pagination: {
        pageSize: pageMeta.perPage
      }
    },
    state: {
      rowSelection
    },
    enableSorting: false,
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const getBrandOptions = useCallback(async () => {
    try {
      const resData = await api.brand.getBrandMenu();
      const formatData = await resData?.map((data) => ({
        value: data.brandId,
        label: data.brandName
      }));
      setBrandOptions(formatData);
    } catch (error) {
      _EHS.errorReport(error, 'getBrandOptions', _EHS._LEVEL.ERROR);
    }
  }, []);

  const handleSearch = useCallback(async (page = 1, perPage = 20) => {
    const _data = { ...modalMethods.getValues() };
    try {
      const reqBody = {
        rewardName: _data?.search ?? '',
        searchType: 'reward_name',
        rewardType: _data?.activityType ?? '',
        startDate: formatStartEndDate(_data?.startDate ?? '', true),
        endDate: formatStartEndDate(_data?.endDate ?? '', false),
        excludePointRewardIds,
        page,
        perPage
      };
      const res = await api.point.getPointSendingList(reqBody);
      if (res) {
        const _formateData =
          res?.sendingList?.length !== 0
            ? res?.sendingList?.map((item) => {
                const _date = `${formatDefTimeNew(
                  item.startDate
                )} - ${formatDefTimeNew(item.endDate)}`;
                return {
                  id: item.rewardId,
                  name: item.rewardName,
                  typeStr: item.rewardTypeStr,
                  type: item.rewardType,
                  date: _date
                };
              })
            : [];
        setData(_formateData);
        setPageMeta(res?.metaData);
      }
    } catch (error) {
      _EHS.errorReport(error, 'getPointSendingList', _EHS._LEVEL.ERROR);
    }
    // eslint-disable-next-line
  }, []);

  //   init
  useEffect(() => {
    if (!brandOptions.length) {
      getBrandOptions();
    }
    handleSearch();
  }, [brandOptions, getBrandOptions, handleSearch]);

  const handleCancel = () => {
    setData([]);
    setRowSelection({});
    setShow(false);
    setExcludePointRewardIds([]);
  };

  useEffect(() => {
    if (show) handleSearch(pageMeta.page, pageMeta.perPage);
    // eslint-disable-next-line
  }, [show]);

  const handleAdd = () => {
    const _data = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original);
    onAdd(_data);
    setData([]);
    setRowSelection({});
    setShow(false);
  };

  const handleCountFetch = (count) => {
    table.setPageSize(Number(count));
    handleSearch(1, +count);
  };

  const handlePageFetch = (page) => {
    handleSearch(+page, pageMeta.perPage);
  };

  return (
    <>
      {show && (
        <FormProvider {...modalMethods}>
          <Modal
            className='table-modal'
            show={show}
            backdrop='static'
            keyboard={false}
            dialogClassName='modal-90w'
            onHide={handleCancel}
          >
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form noValidate>
                <Stack
                  direction='horizontal'
                  className='justify-content-between align-items-center'
                >
                  <p>目前選取 {Object.keys(rowSelection).length} 項</p>
                  <SearchBar
                    name='search'
                    placeholder='活動名稱'
                    isAdvanceSearchBtn
                    isAdvanceOpen={isAdvanceOpen}
                    toggleOpen={() => setIsAdvanceOpen((prev) => !prev)}
                    onSearch={() =>
                      handleSearch(pageMeta.page, pageMeta.perPage)
                    }
                  />
                </Stack>

                <AdvanceSection
                  isOpen={isAdvanceOpen}
                  onSearch={() => handleSearch(pageMeta.page, pageMeta.perPage)}
                  onClose={() => setIsAdvanceOpen((prev) => !prev)}
                  onClear={() => modalMethods.reset()}
                >
                  <div className='search-area'>
                    <FieldGroup title='活動類型' htmlFor='activityType'>
                      <TextField
                        name='activityType'
                        variant='radio'
                        options={[
                          { label: '全部', value: '' },
                          { label: '消費型', value: 'Reward' },
                          { label: '活動型', value: 'Cons' }
                        ]}
                      />
                    </FieldGroup>
                    <FieldGroup title='適用品牌' htmlFor='brandId'>
                      <TextField
                        name='brandId'
                        variant='select'
                        placeholder='全部'
                        options={brandOptions}
                      />
                    </FieldGroup>
                    <FieldGroup title='活動時間'>
                      <TextField
                        variant='radio'
                        name='activityDate'
                        options={[
                          { value: '', label: '不限' },
                          { value: '30', label: '近一個月' },
                          { value: '90', label: '近三個月' },
                          { value: 'custom', label: '自訂' }
                        ]}
                      />
                      <Stack className='mt-2' direction='horizontal'>
                        <TextField
                          variant='datePicker'
                          name='startDate'
                          className='w-100'
                          isStart
                          label=''
                          disabled={activityDateWatch !== 'custom'}
                          dateOptions={{
                            maxDate: modalMethods.watch('endDate')
                          }}
                        />
                        <span className='p-2 px-3'>~</span>
                        <TextField
                          variant='datePicker'
                          name='endDate'
                          className='w-100'
                          isEnd
                          label=''
                          disabled={activityDateWatch !== 'custom'}
                          dateOptions={{
                            minDate: modalMethods.watch('startDate')
                          }}
                        />
                      </Stack>
                    </FieldGroup>
                  </div>
                </AdvanceSection>
              </Form>
              <div className='table-container'>
                <BaseTable
                  table={table}
                  totalCounts={pageMeta.totalCount}
                  totalPages={pageMeta.totalPage}
                  currentPage={pageMeta.page}
                  isDefaultEmpty={false}
                  handlePageFetch={handlePageFetch}
                  handleCountFetch={handleCountFetch}
                />
              </div>
            </Modal.Body>
            <Modal.Footer className='justify-content-center'>
              <Button
                variant='outline-primary'
                type='button'
                onClick={handleCancel}
              >
                取消
              </Button>
              <Button type='button' onClick={handleAdd}>
                確定新增
              </Button>
            </Modal.Footer>
          </Modal>
        </FormProvider>
      )}
    </>
  );
}

export default PointModal;
