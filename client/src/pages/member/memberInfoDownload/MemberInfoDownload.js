import { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import api from 'services/api';

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table';
import { Actions } from 'components/table/Table';
import BaseTable from 'features/table/baseTable/BaseTable';
import SearchBar from 'components/searchBar/SearchBar';

import PermissionAction from 'components/permissionAction/PermissionAction';
import AUTH_CODE from 'config/auth.code.config';

import ExceptionHandleService from 'utils/exceptionHandler';
import { formatDefTimeNew } from 'utils/timeUtils';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/member/memberInfoDownload/MemberInfoDownload.js',
  _NOTICE: ''
});

/* 會員資料下載 */
function MemberInfoDownload() {
  const [list, setList] = useState([]); //table data
  const [sorting, setSorting] = useState(); // table sorting
  const [pageMeta, setPageMeta] = useState({
    totalCount: 0, //總筆數
    totalPage: 0, // 總頁數
    perPage: 20, // 每頁筆數
    page: 1 //當前頁數
  }); //table page

  const methods = useForm({
    defaultValues: {
      search: '',
      searchType: 'export_id' //export_id: 匯出ID
    }
  });

  /* table */
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('exportId', {
      header: 'ID',
      size: 325,
      enableSorting: false
    }),
    columnHelper.accessor('exportName', {
      header: '項目名稱',
      size: 325,
      enableSorting: false
    }),
    columnHelper.accessor('exportDate', {
      header: '匯出時間',
      size: 325,
      cell: (info) => {
        return (
          <div>
            <p>
              {info?.row?.original?.exportUrl
                ? formatDefTimeNew(info.getValue(), {
                    formatString: 'yyyy/MM/dd HH:mm'
                  })
                : '--'}
            </p>
          </div>
        );
      }
    }),
    columnHelper.accessor('createDate', {
      header: '建立時間',
      size: 325,
      enableSorting: true,
      cell: (info) => {
        return (
          <>
            <div>
              <p>{info?.row?.original?.createName ?? ''}</p>
              <p className='text-body-tertiary'>
                {formatDefTimeNew(info.getValue(), {
                  formatString: 'yyyy/MM/dd HH:mm'
                })}
              </p>
            </div>
            <Actions>
              <PermissionAction authCode={AUTH_CODE.MEMBER.INFO.EXPORT}>
                {info?.row?.original?.exportUrl && (
                  <Actions.Download
                    onClick={() => handleDownload(info.row.original.exportUrl)}
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
    getRowId: (row) => row?.exportId,
    columns,
    initialState: {
      pagination: {
        pageSize: 20
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

  const getDataList = useCallback(async (data) => {
    const resData = await api.order.getOrderExportList({
      action: 'memberInfo',
      ...data
    });
    if (resData) {
      setPageMeta(resData?.metaData);
      setList(resData?.memberExportList);
    }
  }, []);

  useEffect(() => {
    getDataList({
      search: '',
      searchType: 'export_id',
      page: 1,
      perPage: 20
    });
  }, [getDataList]);

  const handleSearch = async (page = pageMeta) => {
    const reqBody = {
      search: methods.getValues().search,
      searchType: 'export_id',
      page: page.page,
      perPage: page.perPage
    };
    try {
      getDataList(reqBody);
    } catch (error) {
      _EHS.errorReport(error, 'handleSearch', _EHS._LEVEL.ERROR);
    }
  };

  /** 下載 */
  function handleDownload(csvUrl) {
    try {
      if (csvUrl) {
        const link = document.createElement('a');
        link.href = csvUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      _EHS.errorReport(error, 'handleDownload', _EHS._LEVEL.ERROR);
    }
  }

  // 切換頁碼
  const handlePageFetch = (page) => {
    handleSearch({
      page: +page,
      perPage: +pageMeta.perPage
    });
  };
  // 切換筆數
  const handleCountFetch = (count) => {
    table.setPageSize(Number(count));
    handleSearch({ page: 1, perPage: +count });
  };

  //   if (!list) return null;
  return (
    <div>
      <FormProvider {...methods}>
        <div className='clearfix mb-2'>
          <SearchBar
            placeholder='請輸入ID'
            className='float-end me-3'
            onSearch={handleSearch}
          />
        </div>
      </FormProvider>
      <BaseTable
        table={table}
        isDefaultEmpty={false}
        totalCounts={pageMeta.totalCount}
        totalPages={pageMeta.totalPage}
        currentPage={pageMeta.page}
        perPage={pageMeta.perPage}
        handlePageFetch={handlePageFetch}
        handleCountFetch={handleCountFetch}
      />
    </div>
  );
}

export default MemberInfoDownload;
