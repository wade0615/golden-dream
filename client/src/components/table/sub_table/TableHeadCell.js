import { memo, useState } from 'react';
import { /*FaSort,*/ FaSortUp, FaSortDown } from 'react-icons/fa';

function TableHeadCell({
  children,
  isSortable = false,
  sortClickDisabled = false,
  onSort = (f) => console.log('sort'),
  ...rest
}) {
  const [sortDirection, setSortDirection] = useState(null); // null, ascending 上升, descending下降

  const handleSortClick = (event) => {
    if (sortClickDisabled) {
      return;
    }
    event.preventDefault();
    let newDirection;
    if (sortDirection === null) {
      newDirection = 'ascending'; // 若目前狀態為 null，則設定為升序
    } else if (sortDirection === 'ascending') {
      newDirection = 'descending'; // 若目前狀態為升序，則設定為降序
    } else {
      newDirection = null; // 若目前狀態為降序，則重設為 null
    }
    setSortDirection(newDirection);
    onSort(event);
  };

  return (
    <th {...rest}>
      {/* {isSortable && (
        <span className='sort' onClick={onSort}>
          <FaSort size='12px' />
        </span>
      )} */}
      {isSortable && (
        <span className='sort' onClick={handleSortClick}>
          <FaSortUp
            size='20px'
            style={{
              opacity:
                sortDirection === 'ascending'
                  ? 1
                  : sortDirection === null
                  ? 0.2
                  : 0.2
            }}
          />
          <FaSortDown
            size='20px'
            style={{
              opacity:
                sortDirection === 'descending'
                  ? 1
                  : sortDirection === null
                  ? 0.2
                  : 0.2
            }}
          />
        </span>
      )}
      {children}
    </th>
  );
}

export default memo(TableHeadCell);
