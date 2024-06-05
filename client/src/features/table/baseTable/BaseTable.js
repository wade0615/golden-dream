import Table from 'components/table/Table';
import Pagination from 'components/pagination/Pagination';
import './baseTableStyle.scss';

import { flexRender } from '@tanstack/react-table';

// 若沒有分頁，並且需要顯示超過10筆以上，table 要加入下面這段
// initialState: {
//   // 套件預設只顯示10筆，這邊改為100
//   pagination: {
//     pageSize: 100
//   }
// },

function BaseTable({
  metaData,
  table = null,
  editingRowId = null,
  isFetchMode = true,
  currentPage = 0,
  totalPages = 0,
  totalCounts = 0,
  perPage = 20,
  isDefaultEmpty = true, //是否為預設空文字
  defaultStr = '請先設定查詢條件',
  handlePageFetch = (f) => f,
  handleCountFetch = (f) => f,
  pageCountConfig = [20, 40, 60, 80, 100],
  isPagination = true
}) {
  if (table === null) return;
  return (
    <div className='base-table'>
      <Table role='table'>
        {/* Header */}
        <Table.Head>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // console.log(header);
                  return (
                    <Table.Th
                      scope='col'
                      key={header.id}
                      isSortable={header.column.getCanSort()}
                      onSort={header.column.getToggleSortingHandler()}
                      style={{
                        verticalAlign: 'middle',
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
          {!table?.options?.data?.length ? (
            <Table.Row>
              <Table.Td
                colSpan={table?.options?.columns?.length}
                className='justify-content-center py-4'
              >
                {isDefaultEmpty ? defaultStr : '查無資料'}
              </Table.Td>
            </Table.Row>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id} isEditing={row?.id === editingRowId}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* pagination 是否打api */}
      {isPagination && isFetchMode && (
        <>
          <p className='count-section'>
            共{` ${totalPages} `}頁 / 每頁{' '}
            <select
              id='count'
              className='mx-2'
              // defaultValue={perPage}
              value={table.getState().pagination.pageSize}
              onChange={(e) => handleCountFetch(e.target.value)}
            >
              {pageCountConfig.map((item) => (
                <option id={item} key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            筆，共 {totalCounts} 筆資料
          </p>
          <Pagination
            currentPage={currentPage - 1} // pagination 元件頁數從 0 開始算，但外部資料從 1 開始算
            totalPages={totalPages}
            onFirstPage={() => handlePageFetch(1)}
            onPreviousPage={() => handlePageFetch(currentPage - 1)}
            onNextPage={() => handlePageFetch(currentPage + 1)}
            onLastPage={() => handlePageFetch(totalPages)}
            onSetPage={(e) => handlePageFetch(Number(e.target.text))}
            onPreviousFivePages={() => handlePageFetch(currentPage - 5)}
            onNextFivePages={() => handlePageFetch(currentPage + 5)}
            className='w-100 d-flex justify-content-center'
          />
        </>
      )}
      {isPagination && !isFetchMode && (
        <>
          <p className='count-section'>
            共{` ${table.getPageCount()} `}頁 / 每頁{' '}
            <select
              id='counts'
              className='mx-2'
              // defaultValue={perPage}
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {pageCountConfig.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            筆，共 {metaData?.length ?? 0} 筆資料
          </p>
          <Pagination
            currentPage={table.getState().pagination.pageIndex}
            totalPages={table.getPageCount()}
            onFirstPage={() => table.setPageIndex(0)}
            onPreviousPage={() => table.previousPage()}
            onNextPage={() => table.nextPage()}
            onLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
            onSetPage={(e) => table.setPageIndex(Number(e.target.text) - 1)}
            onPreviousFivePages={() =>
              table.setPageIndex(table.getState().pagination.pageIndex - 5)
            }
            onNextFivePages={() =>
              table.setPageIndex(table.getState().pagination.pageIndex + 5)
            }
            className='w-100 d-flex justify-content-center'
          />
        </>
      )}
    </div>
  );
}

export default BaseTable;
