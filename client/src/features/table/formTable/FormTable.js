import Table from 'components/table/Table';
import Pagination from 'components/pagination/Pagination';
import './baseTableStyle.scss';
import { FormProvider } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { flexRender } from '@tanstack/react-table';

/**
 * @param {any} metaData ?
 * @param {any} table react-table 的資料
 * @param {function} methods react-hook-form 的 methods，供編輯狀態欄位使用
 * @param {object} editingRowId 可編輯的項目id null:無編輯項目 | 0:新增 | 其他數字: 舊有id
 * @param {Boolean} isFetchMode pagination 是否打 api
 * @param {JSX} renderEditRow 可編輯的 table row 樣式
 * @param {Boolean} isDefaultEmpty 是否為預設空文字
 * @param {function} handlePageFetch 頁數切換
 * @param {function} handleCountFetch 每頁數量切換
 * @param {Array} pageCountConfig 每頁比數下拉選單
 * @param {Boolean} isPagination 是否為分頁
 * @param {function} handleUpdateRow row - 編輯狀態 - 儲存
 */
function FormTable({
  metaData,
  table = null,
  methods = {},
  editingRowId = null,
  isFetchMode = true,
  currentPage = 0,
  totalPages = 0,
  totalCounts = 0,
  renderEditRow = null,
  isDefaultEmpty = true, //是否為預設空文字
  handlePageFetch = (f) => f,
  handleCountFetch = (f) => f,
  pageCountConfig = [20, 40, 60, 80, 100],
  isPagination = true,
  handleUpdateRow = (f) => f,
  handleError = (f) => f,
  perPage = 20
}) {
  if (table === null) return;
  return (
    <FormProvider {...methods}>
      {/* <DevTool control={methods.control} />  react hook form 檢查用 */}
      <Form
        noValidate
        onSubmit={methods.handleSubmit(handleUpdateRow, handleError)}
      >
        <div className='base-table'>
          <Table role='table'>
            {/* Header */}
            <Table.Head>
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <Table.Th
                          scope='col'
                          key={header.id}
                          isSortable={header.column.getCanSort()}
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
              {!table?.options?.data?.length ? (
                <Table.Row>
                  <Table.Td
                    colSpan={table?.options?.columns?.length}
                    className='justify-content-center py-4'
                  >
                    {isDefaultEmpty ? '請先設定查詢條件' : '查無資料'}
                  </Table.Td>
                </Table.Row>
              ) : (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <BaseTableRow
                      key={row?.id}
                      row={row}
                      isEditing={row?.id === editingRowId}
                      renderEditRow={renderEditRow}
                    />
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
                  defaultValue={perPage}
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
                  defaultValue={perPage}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {pageCountConfig.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
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
      </Form>
    </FormProvider>
  );
}

function BaseTableRow({ row, renderEditRow = null, isEditing = false }) {
  return (
    <Table.Row key={row.id}>
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

export default FormTable;
