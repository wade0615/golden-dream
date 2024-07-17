// import * as yup from 'yup';
import api from 'services/api';
import './redisStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';
import { useCallback, useEffect, useState } from 'react';
import BaseTable from 'features/table/baseTable/BaseTable';
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Actions } from 'components/table/sub_table';
import alertService from 'utils/alertService';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/redis/Redis.js',
  _NOTICE: ''
});

function RedisGui() {
  const getRedisKeys = useCallback(async (req) => {
    try {
      // const resBody = await api.common.getRedisKeys(req);
      const resBody = ['key1', 'key2', 'key3'];
      if (resBody) {
        const _formatList = resBody.map((body) => {
          return {
            key: body
          };
        });

        setList(_formatList);
      }
    } catch (error) {
      _EHS.errorReport(error, 'getRedisKeys', _EHS._LEVEL.ERROR);
    }
  }, []);

  /** 刪除 通知分類 */
  const delRedisKey = (key) => {
    try {
      alertService.confirm({}).then(async (res) => {
        if (res.isConfirmed) {
          await api.common.delRedisKey(key);
          alertService.toast({ title: '刪除成功' });
          getRedisKeys();
        }
      });
    } catch (error) {
      _EHS.errorReport(error, 'delRedisKey', _EHS._LEVEL.ERROR);
    }
  };

  const [list, setList] = useState(null); //table data
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('key', {
      header: 'key',
      enableSorting: false
    }),
    columnHelper.accessor('del', {
      header: '是否刪除',
      cell: (info) => (
        <>
          <Actions>
            <Actions.Delete
              onClick={() => delRedisKey({ key: info.row.id })}
              type='button'
            />
          </Actions>
        </>
      )
    })
  ];

  useEffect(() => {
    getRedisKeys();
  }, [getRedisKeys]);

  const table = useReactTable({
    data: list,
    getRowId: (row) => row?.key,
    columns,
    initialState: {
      pagination: {
        pageSize: 20
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div id='redis' className='redis_container'>
      <div className='redis_table'>
        <BaseTable table={table} isDefaultEmpty={false} />
      </div>
    </div>
  );
}

export default RedisGui;
