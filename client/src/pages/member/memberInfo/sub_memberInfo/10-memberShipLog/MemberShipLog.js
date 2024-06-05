import { useEffect, useState, useContext, useCallback } from 'react';
import { MemberInfoContext } from '../../MemberInfo';
import { FormProvider } from 'react-hook-form';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import api from 'services/api';
import BaseTable from 'features/table/baseTable/BaseTable';
import { Form } from 'react-bootstrap';

import Info from '../0-component/Info';
import BillBoard from '../0-component/billBoard';
import { formatDefTimeNew } from 'utils/timeUtils';

import '../../../addMember/addMemberStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/member/addMember/AddMember.js',
  _NOTICE: ''
});

/** 會員詳情 - 會籍歷程 */
function MemberShipLog() {
  const { commonData, memberId } = useContext(MemberInfoContext);
  const [data, setData] = useState([]); // table 資料
  const [billData, setBillData] = useState([]); // 中間區塊數字

  const [pageMeta, setPageMeta] = useState({
    totalCount: 0, //總筆數
    totalPage: 0, // 總頁數
    perPage: 20, // 每頁筆數
    page: 1 //當前頁數
  });

  /* table config */
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('memberShipName', {
      header: '會籍',
      size: 374
    }),
    columnHelper.accessor('actionType', {
      header: '項目',
      size: 374
    }),
    columnHelper.accessor('startDate', {
      header: '起始日',
      size: 200
    }),
    columnHelper.accessor('endDate', {
      header: '到期日',
      size: 200
    }),
    columnHelper.accessor('createTime', {
      header: '系統異動日',
      size: 200
    })
  ];

  const table = useReactTable({
    data: data,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
    columns
  });

  /* table 換頁數切換 */
  const handlePageFetch = (page) => {
    getList({
      memberId,
      page: Number(page),
      perPage: pageMeta.perPage
    });
  };
  const handleCountFetch = (count) => {
    table.setPageSize(Number(count));
    getList({
      memberId,
      page: 1,
      perPage: Number(count)
    });
  };

  /** 取得列表 */
  const getList = useCallback(async (params) => {
    try {
      const list = await api.member.getMemberShipLog(params);
      if (list) {
        const formatList = list?.logList?.map((item) => {
          const _createTime = item?.createTime
            ? formatDefTimeNew(item?.createTime, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '';
          return {
            memberShipName: item?.memberShipName ?? '',
            actionType: item?.actionType ?? '',
            startDate: item?.startDate ?? '',
            endDate: item?.endDate ?? '-',
            createTime: _createTime
          };
        });
        setPageMeta((prev) => ({ ...prev, ...list.metaData }));
        setData(formatList);
        setBillData(list?.billInfo);
      }
    } catch (error) {
      _EHS.errorReport(error, 'getList', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** init */
  useEffect(() => {
    if (!memberId) return;
    const req = {
      memberId
    };
    getList(req);
    // eslint-disable-next-line
  }, [getList]);

  return (
    <FormProvider>
      <div className='mx-4'>
        <Form noValidate>
          {/* 會員資訊共用區塊 */}
          <Info
            name={commonData?.name}
            mobile={`${commonData?.mobileCountryCode}-${commonData?.mobile}`}
            chips={[commonData?.membershipStatus, commonData?.specialTypeName]}
          ></Info>
          {/* 顯示區塊 */}
          <BillBoard data={billData} />
          <BaseTable
            table={table}
            totalCounts={pageMeta.totalCount}
            totalPages={pageMeta.totalPage}
            currentPage={pageMeta.page}
            handlePageFetch={handlePageFetch}
            handleCountFetch={handleCountFetch}
          />
        </Form>
      </div>
    </FormProvider>
  );
}

export default MemberShipLog;
