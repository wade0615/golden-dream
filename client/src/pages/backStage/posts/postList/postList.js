import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table';

import { GetPostsClass } from './postListClass';
import api from 'services/api';
import { varifyLoginToken } from 'utils/commonUtil';
import { formatDefTimeNew, formatStartEndDate } from 'utils/timeUtils';
import routerPath from 'routes/router.path';
// import { useSelector, useDispatch } from 'react-redux';
// import { setOption } from 'store/slice/globalOptionsSlice';
// import { optionType } from 'constants/optionType';

// import alertService from 'utils/alertService';
import IndeterminateCheckbox from 'components/indeterminateCheckbox/IndeterminateCheckbox';
import Table, { Actions } from 'components/table/Table';
import AdvanceSearch from 'features/advanceSearch/AdvanceSearch';
// import Button from 'react-bootstrap/Button';
import BaseTable from 'features/table/baseTable/BaseTable';
import TextField from 'features/textField/TextField';
import FieldGroup from 'features/textField/sub_textField/FieldGroup';
import { Col, Row, Container, Stack } from 'react-bootstrap';

import './postListStyle.scss';
import PermissionAction from 'components/permissionAction/PermissionAction';
import AUTH_CODE from 'config/auth.code.config';
import AddItemButton from 'components/button/addItemButton/AddItemButton';
// import exportCsvType from 'constants/exportCsvType';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/backStage/posts/postList.js',
  _NOTICE: ''
});

/* helper function */
const RangeDate = (dayCounts, startDate = new Date()) =>
  new Date(new Date().setDate(startDate.getDate() + Number(dayCounts)));

/* default search from values */
const _defaultSearch = {
  search: '',
  searchType: 'mobile', //mobile: 手機/member_name: 姓名/member_card: 卡號
  registerRange: 'all',
  startDate: '',
  endDate: '',
  // startDate: formatDefTimeNew(RangeDate(-30), {
  //   isStart: true,
  //   formatString: 'yyyy/MM/dd HH:mm:ss'
  // }),
  // endDate: formatDefTimeNew(new Date(), {
  //   isStart: false,
  //   formatString: 'yyyy/MM/dd HH:mm:ss'
  // }),
  memberSpecialType: 0,
  membershipStatus: ''
};

const getStatusText = (isPublish, isPublic) => {
  if (isPublish && isPublic) {
    return "已發佈並公開";
  } else if (isPublish && !isPublic) {
    return "已發佈未公開";
  } else {
    return "未發佈";
  }
};

/** 後台文章列表 */
function PostList() {
  const [listData, setListData] = useState([]); // table original datarestValues
  // const [searchData, setSearchData] = useState(_defaultSearch);
  const [pageMeta, setPageMeta] = useState({
    totalCount: 0, //總筆數
    totalPages: 0, // 總頁數
    perPage: 10, // 每頁筆數
    page: 1 //當前頁數
  });
  const [isDefaultEmpty, setIsDefaultEmpty] = useState(true); // table empty string type
  const [sorting, setSorting] = useState(); // table sorting
  // const [memberStatusOptions, setMemberStatusOptions] = useState([]);
  // const specialMemberTypeOption = useSelector(
  //   (state) => state.options.specialMemberType
  // );
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  /* table config */
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('checkbox', {
      enableSorting: false,
      header: ({ table }) => (
        <PermissionAction authCode={AUTH_CODE.MEMBER.INFO.EXPORT}>
          <IndeterminateCheckbox
            name='checkbox-all'
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        </PermissionAction>
      ),
      cell: ({ row }) => (
        <PermissionAction authCode={AUTH_CODE.MEMBER.INFO.EXPORT}>
          <IndeterminateCheckbox
            name={crypto.randomUUID()}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </PermissionAction>
      )
    }),
    columnHelper.accessor('postId', {
      header: '文章編號',
      enableSorting: false
    }),
    columnHelper.accessor('title', {
      header: '文章標題',
      enableSorting: false
    }),
    columnHelper.accessor('category', {
      header: '文章分類',
      enableSorting: false
      // cell: (info) => (
      //   <>
      //     {info.row.original.isDelete !== 0 && (
      //       <div className='deleteTag'>Delete</div>
      //     )}
      //     {info.getValue()}
      //   </>
      // )
    }),
    columnHelper.accessor('isPublish', {
      header: '是否發佈',
      cell: (info) => {
        const isPublish = info.getValue();
        const isPublic = info.row.original.isPublic; // 假設有這個欄位
        
        let variant = 'tag--secondary'; // 預設未發佈
        if (isPublish && isPublic) {
          variant = 'tag--success'; // 已發佈並公開
        } else if (isPublish && !isPublic) {
          variant = 'tag--info'; // 已發佈未公開
        }
        
        return <Table.Tag variant={variant}>{getStatusText(isPublish, isPublic)}</Table.Tag>;
      },
      enableSorting: false
    }),
    columnHelper.accessor('createDate', {
      header: '建立時間'
    }),
    columnHelper.accessor('updateDate', {
      header: '更新時間'
    }),
    columnHelper.accessor('updatePerson', {
      header: '更新人員',
      enableSorting: false,
      cell: (info) => (
        <>
          {info.getValue()}{' '}
          <Actions>
            <PermissionAction authCode={AUTH_CODE.MEMBER.INFO.CREATE_UPDATE}>
              <Actions.Edit
                onClick={() => handleMemberInfo(info.row.id, 'edit')}
              />
            </PermissionAction>
            <PermissionAction authCode={AUTH_CODE.MEMBER.INFO.READ}>
              <Actions.View
                onClick={() => handleMemberInfo(info.row.id, 'view')}
              />
            </PermissionAction>
          </Actions>{' '}
        </>
      )
    })
  ];

  /* table list */
  const table = useReactTable({
    data: listData,
    getRowId: (row) => row?.postId,
    columns,
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  /* search form */
  const methods = useForm({
    defaultValues: _defaultSearch
    // resolver: yupResolver(_defaultSearchSchema)
  });

  const registerRangeWatch = methods.watch('registerRange');

  const getInit = useCallback(async () => {
    try {
      // 取得 會籍, 特殊會員類型下拉式選項
      // const [specialTypeMemberData, memberStatusData] = await Promise.all([
      //   api.member.getMemberSpecialTypeMenu(),
      //   api.memberShip.getMemberShipMenu()
      // ]);
      // if (specialTypeMemberData) {
      //   const formatType = specialTypeMemberData.list.map((item) => ({
      //     value: item.seq,
      //     label: item.name
      //   }));
      //   dispatch(
      //     setOption({
      //       type: optionType.specialMemberType,
      //       payload: formatType
      //     })
      //   );
      // }
      // if (memberStatusData) {
      //   setMemberStatusOptions(memberStatusData.memberShipList);
      // }
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, []);

  const getMemberList = useCallback(async (req) => {
    try {
      const apiRes = await api.backStage.getBackStagePostList(req);
      if (apiRes) {
        const res = new GetPostsClass(apiRes);
        setListData(res.postList);
        setPageMeta((prev) => ({ ...prev, ...res.metaData }));
        setIsDefaultEmpty(false);
        // setSearchData(req); // 批次匯出用，暫存此次搜尋條件
      }
    } catch (error) {
      _EHS.errorReport(error, 'getMemberList', _EHS._LEVEL.ERROR);
    }
  }, []);

  // 初始化
  useEffect(() => {
    varifyLoginToken();
    getInit();
  }, [getInit]);

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
    switch (registerRangeWatch) {
      case '30':
      case '90':
        const dayCount = registerRangeWatch === '30' ? -30 : -90;
        setFormattedDate('startDate', RangeDate(dayCount), true);
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
  }, [registerRangeWatch, methods]);

  /* table 換頁數切換 */
  const handlePageFetch = (page) => {
    const { registerRange, ...restValues } = methods.getValues();
    getMemberList({
      ...restValues,
      memberSpecialType: Number(restValues.memberSpecialType),
      startDate: formatStartEndDate(restValues.startDate, true),
      endDate: formatStartEndDate(restValues.endDate, false),
      page: Number(page),
      perPage: pageMeta.perPage
    });
  };
  const handleCountFetch = (count) => {
    table.setPageSize(Number(count));
    const { registerRange, ...restValues } = methods.getValues();
    getMemberList({
      ...restValues,
      memberSpecialType: Number(restValues.memberSpecialType),
      startDate: formatStartEndDate(restValues.startDate, true),
      endDate: formatStartEndDate(restValues.endDate, false),
      page: 1,
      perPage: Number(count)
    });
  };

  /* 批次匯出  */
  // const handleExportAll = async () => {
  //   // const { registerRange, ...restValues } = methods.getValues();
  //   const reqBody = {
  //     action: exportCsvType.memberInfo,
  //     params: searchData
  //     // params: {
  //     //   ...restValues,
  //     //   memberSpecialType: Number(restValues.memberSpecialType),
  //     //   startDate: startOfTheDay(restValues.startDate),
  //     //   endDate: endOfTheDay(restValues.endDate)
  //     // }
  //   };
  //   const res = await api.common.exportCsvData(reqBody);
  //   if (!!res?.msg) {
  //     console.log(res?.msg);
  //     return;
  //   }
  //   if (res) {
  //     await alertService.toast({
  //       title: '檔案匯出中，請稍候~<br>完成時會發送Email通知。',
  //       time: 5000
  //     });
  //   }
  //   // const { registerRange, ...restValues } = methods.getValues();
  //   // const reqBody = {
  //   //   ...restValues,
  //   //   memberSpecialType: Number(restValues.memberSpecialType),
  //   //   startDate: startOfTheDay(restValues.startDate),
  //   //   endDate: endOfTheDay(restValues.endDate)
  //   // };
  //   // const blob = await api.member.exportMemberList(reqBody);
  //   // // Set the suggested filename (if available) for the downloaded file
  //   // const url = URL.createObjectURL(blob);
  //   // const link = document.createElement('a');
  //   // link.href = url;
  //   // const fileDate = format(new Date(), 'yyyyMMdd');
  //   // link.setAttribute('download', `${fileDate}-會員資料.zip`);
  //   // document.body.appendChild(link);
  //   // link.click();
  //   // URL.revokeObjectURL(url);
  // };

  // const handleExportSome = async () => {
  //   const selectedIdArr = Object.keys(table.getState().rowSelection);
  //   const reqBody = {
  //     action: exportCsvType.memberInfo,
  //     params: {
  //       memberId: selectedIdArr
  //     }
  //   };
  //   const res = await api.common.exportCsvData(reqBody);
  //   if (!!res?.msg) {
  //     console.log(res?.msg);
  //     return;
  //   }
  //   if (res) {
  //     await alertService.toast({
  //       title: '檔案匯出中，請稍候~<br>完成時會發送Email通知。',
  //       time: 5000
  //     });
  //   }
  //   // const selectedIdArr = Object.keys(table.getState().rowSelection);
  //   // const blob = await api.member.exportMemberList({
  //   //   memberIds: selectedIdArr
  //   // });
  //   // // Set the suggested filename (if available) for the downloaded file
  //   // const url = URL.createObjectURL(blob);
  //   // const link = document.createElement('a');
  //   // link.href = url;
  //   // const fileDate = format(new Date(), 'yyyyMMdd');
  //   // link.setAttribute('download', `${fileDate}-會員資料.zip`);
  //   // document.body.appendChild(link);
  //   // link.click();
  //   // URL.revokeObjectURL(url);
  // };

  /* search submit */
  const onSubmit = (data, e) => {
    console.log('onSubmit', data);
    e.preventDefault();
    const { registerRange, ...restValues } = methods.getValues();
    getMemberList({
      ...restValues,
      memberSpecialType: Number(restValues.memberSpecialType),
      startDate: formatStartEndDate(data?.startDate ?? '', true),
      endDate: formatStartEndDate(data?.endDate ?? '', false),
      perPage: pageMeta.perPage ?? 10,
      page: 1
    });
  };
  const onError = (error) => {
    console.log(error);
  };

  /* 前往新增頁 */
  const handleNewMember = () => {
    navigate(
      `/${routerPath.secretDoor}/${routerPath.secretDoor_Post}/${routerPath.secretDoor_Post_PostPage}`,
      {
        state: {
          pageMode: 'add'
        }
      }
    );
  };

  /* 前往會員基本資料頁 */
  function handleMemberInfo(id, panel = 'view') {
    navigate(
      `/${routerPath.secretDoor}/${routerPath.secretDoor_Post}/${routerPath.secretDoor_Post_PostPage}?id=${id}`,
      {
        state: {
          pageMode: panel
        }
      }
    );
  }

  return (
    <div id='backstage_post_list'>
      <AdvanceSearch
        searchBarName='search'
        searchBarOptionsName='searchType'
        methods={methods}
        onSubmit={onSubmit}
        onError={onError}
        totalCount={pageMeta.totalCount}
        placeholder='請輸入關鍵字'
        searchTypeOptions={[
          { value: 'title', label: '文章標題' },
          { value: 'post_type', label: '分類' }
        ]}
      >
        <Container fluid>
          <Row className='gx-5'>
            {/* <Col sm={6}>
              <FieldGroup htmlFor='membershipStatus' title='會員會籍'>
                <TextField
                  variant='select'
                  name='membershipStatus'
                  id='membershipStatus'
                  options={memberStatusOptions}
                />
              </FieldGroup>
            </Col>
            <Col sm={6}>
              <FieldGroup htmlFor='memberSpecialType' title='特殊會員類型'>
                <TextField
                  variant='select'
                  name='memberSpecialType'
                  id='memberSpecialType'
                  options={specialMemberTypeOption}
                />
              </FieldGroup>
            </Col> */}

            <Col sm={6}>
              <FieldGroup title='建立時間'>
                <TextField
                  variant='radio'
                  name='createRange'
                  options={[
                    { value: 'all', label: '不限' },
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
                    disabled={registerRangeWatch !== 'custom'}
                    dateOptions={{
                      maxDate: methods.watch('endDate')
                    }}
                  />
                  <span className='p-2 px-3'>~</span>
                  <TextField
                    variant='datePicker'
                    name='endDate'
                    className='w-100'
                    isEnd
                    label=''
                    disabled={registerRangeWatch !== 'custom'}
                    dateOptions={{
                      minDate: methods.watch('startDate')
                    }}
                  />
                </Stack>
              </FieldGroup>
            </Col>
          </Row>
        </Container>
      </AdvanceSearch>
      <div className='section-actions'>
        {/* <PermissionAction authCode={AUTH_CODE.MEMBER.INFO.EXPORT}>
          {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
            <Button
              type='button'
              variant='outline-info'
              size='sm'
              onClick={handleExportSome}
            >
              匯出選取資料
            </Button>
          )}
        </PermissionAction> */}
        {/* <PermissionAction authCode={AUTH_CODE.MEMBER.INFO.EXPORT}>
          <Button
            type='button'
            variant='info'
            size='sm'
            className='text-white'
            onClick={handleExportAll}
            disabled={!listData.length}
          >
            匯出CSV
          </Button>
        </PermissionAction> */}
        <PermissionAction authCode={AUTH_CODE.MEMBER.INFO.CREATE_UPDATE}>
          <AddItemButton className='text-white' onClick={handleNewMember} />
        </PermissionAction>
      </div>
      <BaseTable
        table={table}
        isDefaultEmpty={isDefaultEmpty}
        totalCounts={pageMeta.totalCount}
        totalPages={pageMeta.totalPages}
        currentPage={pageMeta.page}
        handlePageFetch={handlePageFetch}
        handleCountFetch={handleCountFetch}
        pageCountConfig={[10, 20, 40, 60, 80, 100, 500]}
      />
    </div>
  );
}

export default PostList;
