import Table from 'components/table/Table';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { flexRender } from '@tanstack/react-table';
import { FormProvider } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
// import { DevTool } from '@hookform/devtools';

import { DragIcon } from 'assets/icons';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';
import './dragTableStyle.scss';

/**
 * 注意！若有 editingRowData, 即無法拖曳，也無法編輯/新增/刪除
 * editingRowData 只會有一筆資料，儲存後才能進行其他動作
 * @param {any} table react-table 的資料
 * @param {object} tableData table的原始資料，供拖曳功能使用
 * @param {function} setTableData 拖曳時，重新setData
 * @param {object} editingRowId 可編輯的項目id null:無編輯項目 | 0:新增 | 其他數字: 舊有id
 * @param {function} renderEditRow 渲染可編輯的table row 樣式
 * @param {} methods react-hook-form 的 methods，供編輯狀態欄位使用
 * @param {string} authCode auth.code.config 的 權限代碼，影響拖曳功能的使用
 */
function DragTable({
  table = null,
  tableData = null,
  setTableData = (f) => f,
  editingRowId = null,
  renderEditRow = null,
  methods = {},
  handleUpdateRow = (f) => f,
  handleError = (f) => f,
  handleOrders = null,
  sortClickDisabled = false,
  authCode
}) {
  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  const hasPermission =
    Array.isArray(userInfo.authItems) && userInfo.authItems.includes(authCode);
  const reorderRow = (draggedRowIndex, targetRowIndex) => {
    if (tableData.length === 0) return;
    tableData.splice(
      targetRowIndex,
      0,
      tableData.splice(draggedRowIndex, 1)[0]
    );
    setTableData([...tableData]);
    handleOrders && handleOrders();
  };
  if (table === null || tableData === null) return;
  return (
    <DndProvider backend={HTML5Backend}>
      <FormProvider {...methods}>
        {/* <DevTool control={methods.control} />  react hook form 檢查用 */}
        <Form
          noValidate
          onSubmit={methods?.handleSubmit(handleUpdateRow, handleError)}
        >
          <div className='drag-table'>
            <Table role='table'>
              {/* Header */}
              <Table.Head>
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <Table.Row key={headerGroup.id}>
                      <Table.Th style={{ width: '40px' }} />
                      {headerGroup.headers.map((header) => {
                        return (
                          <Table.Th
                            scope='col'
                            colSpan={header.colSpan}
                            key={header.id}
                            isSortable={header.column.getCanSort()}
                            sortClickDisabled={editingRowId !== null}
                            onSort={header.column.getToggleSortingHandler()}
                            style={{
                              width:
                                header.column.getSize() !== 150
                                  ? header.column.getSize()
                                  : ''
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </Table.Th>
                        );
                      })}
                    </Table.Row>
                  );
                })}
              </Table.Head>
              {/* body */}

              <Table.Body>
                {!table?.options?.data?.length && tableData.length === 0 ? (
                  <Table.Row>
                    <Table.Td
                      colSpan={table?.options?.columns?.length + 1}
                      className='d-flex justify-content-center align-items-center py-4'
                    >
                      請先新增資料
                    </Table.Td>
                  </Table.Row>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    return (
                      <DraggableRow
                        key={row?.id}
                        row={row}
                        reorderRow={reorderRow}
                        isDraggable={editingRowId === null && hasPermission}
                        isEditing={row?.id === editingRowId}
                        renderEditRow={renderEditRow}
                      />
                    );
                  })
                )}
              </Table.Body>
            </Table>
          </div>
        </Form>
      </FormProvider>
    </DndProvider>
  );
}

function DraggableRow({
  row,
  reorderRow,
  isDraggable = true,
  isEditing = false,
  renderEditRow = null
}) {
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    // 將 rerender 設置為 true 以觸發組件重新渲染
    const timeoutId = setTimeout(() => {
      setRerender(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const [, dropRef] = useDrop({
    accept: 'row',
    drop: (draggedRow) => reorderRow(draggedRow.index, row.index)
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    canDrag: isDraggable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    item: () => row,
    type: 'row'
  });

  if (!rerender) {
    return null;
  }

  return (
    <Table.Row ref={previewRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Table.Td ref={dropRef} style={{ width: '40px' }}>
        <button ref={dragRef} data-drag={true} disabled={!isDraggable}>
          <DragIcon />
        </button>
      </Table.Td>
      {!isEditing
        ? row
            .getVisibleCells()
            .map((cell) => (
              <Table.Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Td>
            ))
        : renderEditRow(row.original)}
    </Table.Row>
  );
}

export default DragTable;
