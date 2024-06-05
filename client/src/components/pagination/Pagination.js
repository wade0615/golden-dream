import { useState, useEffect } from 'react';
import { Pagination as BPagination } from 'react-bootstrap';

function Pagination({
  pageRange = 5,
  currentPage = 0,
  totalPages = 0,
  onFirstPage = (f) => f,
  onPreviousPage = (f) => f,
  onNextPage = (f) => f,
  onLastPage = (f) => f,
  onSetPage = (f) => f,
  onNextFivePages = (f) => f,
  onPreviousFivePages = (f) => f,
  ...rest
}) {
  const [pageArr, setPageArr] = useState([]);
  const pagesGreatThan = (num) => totalPages > num;
  const isCurrentFirst = currentPage === 0;
  const isCurrentLast = currentPage === totalPages - 1;
  const greatThan5 = pagesGreatThan(pageRange - 1);

  // 渲染頁碼，超過5頁，固定渲染 5 個頁碼
  useEffect(() => {
    let tempArr = [];
    for (let i = 0; i < pageRange; i++) {
      //  totalPages 不足5頁
      if (totalPages <= i) {
        setPageArr(tempArr);
        return;
      }
      // totalPages 超過5頁
      if (totalPages < pageRange || currentPage < pageRange) {
        tempArr.push(i);
      } else if (totalPages - currentPage <= pageRange) {
        tempArr.push(totalPages - pageRange + i);
      } else {
        tempArr.push(currentPage - 2 + i);
      }
    }
    setPageArr(tempArr);
  }, [currentPage, totalPages, pageRange]);

  if (!totalPages) return;
  return (
    <BPagination {...rest}>
      {/* <<：第一頁 */}
      {greatThan5 && currentPage >= pageRange && (
        <BPagination.First onClick={onFirstPage} />
      )}
      {/* <: 向前一頁 */}
      {!isCurrentFirst && <BPagination.Prev onClick={onPreviousPage} />}

      {greatThan5 && currentPage >= pageRange && (
        <BPagination.Ellipsis onClick={onPreviousFivePages} />
      )}
      {/* 數字 */}
      {pageArr?.map((page) => (
        <BPagination.Item
          key={page}
          active={currentPage === page}
          onClick={currentPage !== page ? onSetPage : (f) => f}
        >
          {page + 1}
        </BPagination.Item>
      ))}

      {greatThan5 && totalPages - currentPage >= pageRange && (
        <BPagination.Ellipsis onClick={onNextFivePages} />
      )}

      {/* >：向後一頁 */}
      {!isCurrentLast && <BPagination.Next onClick={onNextPage} />}
      {/* >>：最後一頁 */}
      {greatThan5 && !isCurrentLast && (
        <BPagination.Last onClick={onLastPage} />
      )}
    </BPagination>
  );
}
export default Pagination;
