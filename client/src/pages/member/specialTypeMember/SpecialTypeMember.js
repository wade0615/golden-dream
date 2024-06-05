import { useState, useEffect, useCallback } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import api from 'services/api';
import alertService from 'utils/alertService';
import { formatDefTimeNew } from 'utils/timeUtils';

import DragTable from 'features/table/dragTable/DragTable';
import TextField from 'features/textField/TextField';

import Table, { Actions } from 'components/table/Table';
import { StateChip } from 'components/chip';
import AddItemButton from 'components/button/addItemButton/AddItemButton';
import PermissionAction from 'components/permissionAction/PermissionAction';
import AUTH_CODE from 'config/auth.code.config';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/member/specialTypeMember/SpecialTypeMember.js',
  _NOTICE: ''
});

const _defaultNewData = {
  id: 0, //for前端新增判斷用
  specialId: 0, //for前端新增判斷用
  title: '',
  isPoint: false,
  isLevelUp: false,
  status: false,
  createTime: '',
  updateTime: ''
};

const _schema = yup.object({
  title: yup.string().required('必填').max(10, '最多10個字')
});

/** 特殊會員類型 */
function SpecialTypeMember() {
  const [tableData, setTableData] = useState([]); // table 資料
  const [editOpenId, setEditOpenId] = useState(null); // 控制 row 是否編輯狀態
  const methods = useForm({
    defaultValues: _defaultNewData,
    resolver: yupResolver(_schema)
  });

  // 取得列表
  const getList = useCallback(async () => {
    try {
      const list = await api.member.getMemberSpecialList();
      if (list) {
        const formatList = list?.map((item) => {
          const _updateTime = item?.alterTime
            ? formatDefTimeNew(item?.alterTime, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '';
          const _createTime = item?.alterTime
            ? formatDefTimeNew(item?.createTime, {
                formatString: 'yyyy/MM/dd HH:mm'
              })
            : '';
          return {
            specialId: item?.specialId ?? '',
            title: item?.typeName ?? '',
            isPoint: item?.isEarnPoints ?? false,
            isLevelUp: item?.isPromoteRank ?? false,
            status: item?.state ?? false,
            createTime: _createTime,
            createPerson: item?.createName ?? '',
            updateTime: _updateTime,
            updatePerson: item?.alterName ?? ''
          };
        });
        setTableData(formatList);
      }
    } catch (error) {
      _EHS.errorReport(error, 'getList', _EHS._LEVEL.ERROR);
    }
  }, []);

  // 新增或修改
  const updateRowData = useCallback(
    async (params) => {
      try {
        const resOk = await api.member.updMemberSpecialDetail(params);
        if (resOk) {
          const resStr = !!params.specialId ? '修改成功' : '新增成功';
          alertService.toast({ title: resStr });
          getList(); //更新清單
          methods.reset(_defaultNewData);
          setEditOpenId(null);
        }
      } catch (error) {
        _EHS.errorReport(error, 'updateRowData', _EHS._LEVEL.ERROR);
      }
    },
    [getList, methods]
  );

  // init
  useEffect(() => {
    getList();
  }, [getList]);

  /* table config */
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('title', {
      header: '類型名稱'
    }),
    columnHelper.accessor('isPoint', {
      header: '可回饋積點/集點',
      size: 160,
      cell: (info) => (info.getValue() ? '是' : '否')
    }),
    columnHelper.accessor('isLevelUp', {
      header: '可升降等',
      size: 160,
      cell: (info) => (info.getValue() ? '是' : '否')
    }),
    columnHelper.accessor('status', {
      header: '狀態',
      size: 160,
      cell: (info) => <StateChip state={info.getValue()} />
    }),
    columnHelper.accessor('createTime', {
      enableSorting: true,
      header: '建立時間',
      size: 160,
      cell: (info) => (
        <div>
          <p> {info.row.original.createPerson}</p>
          <p className='text-body-tertiary'>{info.getValue()}</p>
        </div>
      )
    }),
    columnHelper.accessor('updateTime', {
      enableSorting: true,
      header: '更新時間',
      size: 160,
      cell: (info) => (
        <>
          <div>
            <p> {info.row.original.updatePerson}</p>
            <p className='text-body-tertiary'>{info.getValue()}</p>
          </div>

          <Actions>
            <PermissionAction authCode={AUTH_CODE.MEMBER.SPECIAL.CREATE_UPDATE}>
              <Actions.Edit
                disabled={editOpenId !== null}
                onClick={() => handleOpenEditRow(info.row.original)}
                type='button'
              />
            </PermissionAction>
            <PermissionAction authCode={AUTH_CODE.MEMBER.SPECIAL.DELETE}>
              <Actions.Delete
                disabled={editOpenId !== null}
                onClick={() => handleDeleteRow(info.row.id)}
                type='button'
              />
            </PermissionAction>
          </Actions>
        </>
      )
    })
  ];
  /* table list */
  const table = useReactTable({
    data: tableData,
    getRowId: (row) => row?.specialId,
    columns,
    initialState: {
      pagination: {
        pageSize: 999
      }
    },
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
    // table data 內部修改 method
    // meta: {
    //   updateData: (rowIndex, columnId, value) => {
    //     setTableData((old) =>
    //       old.map((row, index) => {
    //         if (index === rowIndex) {
    //           return {
    //             ...old[rowIndex],
    //             [columnId]: value
    //           };
    //         }
    //         return row;
    //       })
    //     );
    //   }
    // }
  });

  /* 定義可編輯 row */
  const renderEditRow = (row) => (
    <>
      <Table.Td>
        <TextField
          name='title'
          className='flex-fill'
          maxLength={10}
          placeholder='限10個字以內'
        />
      </Table.Td>
      <Table.Td>
        <TextField name='isPoint' variant='singleCheckbox' label='是' />
      </Table.Td>
      <Table.Td>
        <TextField name='isLevelUp' variant='singleCheckbox' label='是' />
      </Table.Td>
      <Table.Td>
        <TextField name='status' variant='singleCheckbox' label='啟用' />
      </Table.Td>
      <Table.Td />
      <Table.Td>
        <Actions isShown>
          <Actions.CancelBtn onClick={handleCancelRow} />
          <Actions.SaveBtn onClick={handleUpdateRow} />
        </Actions>
      </Table.Td>
    </>
  );

  // row 新增
  function handleAddNewRow() {
    setTableData((prev) => [_defaultNewData, ...prev]); // 前端table先新增一筆資料
    methods.reset(_defaultNewData);
    setEditOpenId(_defaultNewData.id);
  }

  // row  編輯
  function handleOpenEditRow(val) {
    methods.reset({ ...val });
    setEditOpenId(val.specialId);
  }

  // row 刪除
  function handleDeleteRow(id) {
    try {
      alertService.confirm({}).then(async (res) => {
        if (res.isConfirmed) {
          const res = await api.member.delMemberSpecialDetail({
            specialId: id
          });
          if (res) {
            alertService.toast({ title: '刪除成功' });
            getList();
          }
        }
      });
    } catch (error) {
      _EHS.errorReport(error, 'handleDeleteRow', _EHS._LEVEL.ERROR);
    }
  }

  async function handleOrders() {
    try {
      const specialSorts = tableData.reduce(
        (acu, cur) => [...acu, String(cur.specialId)],
        []
      );
      await api.member.updMemberSpecialRank({ specialSorts });
      getList();
    } catch (error) {
      _EHS.errorReport(error, 'handleOrders', _EHS._LEVEL.ERROR);
    }
  }

  // row - 編輯狀態 - 儲存
  async function handleUpdateRow() {
    const isValid = await methods.trigger(); //validate form
    if (isValid) {
      const value = methods.getValues(); // 取得修改後的資料
      const updateReq = {
        specialId: value.specialId ?? 0,
        typeName: value.title,
        isEarnPoints: value.isPoint,
        isPromoteRank: value.isLevelUp,
        state: value.status
      };
      await updateRowData(updateReq);
    }
  }
  // row - 編輯狀態 - 取消
  function handleCancelRow() {
    const newData = [...tableData.filter((row) => row.specialId !== 0)]; // 移除新增的 table row
    setTableData(newData);
    methods.reset(_defaultNewData);
    setEditOpenId(null);
  }

  return (
    <div>
      <PermissionAction authCode={AUTH_CODE.MEMBER.SPECIAL.CREATE_UPDATE}>
        <AddItemButton
          className='text-white float-end me-3 mb-2'
          disabled={editOpenId !== null}
          onClick={handleAddNewRow}
        />
      </PermissionAction>
      <DragTable
        table={table}
        isDefaultEmpty={true}
        tableData={tableData}
        setTableData={setTableData}
        editingRowId={editOpenId}
        renderEditRow={renderEditRow}
        methods={methods}
        handleUpdateRow={handleUpdateRow}
        handleOrders={handleOrders}
        authCode={AUTH_CODE.MEMBER.SPECIAL.CREATE_UPDATE}
      />
    </div>
  );
}

export default SpecialTypeMember;
