import { memo, forwardRef } from 'react';

const TableCell = forwardRef(
  ({ type = 'td', children, className = '', ...rest }, ref) => {
    return (
      <td {...rest} ref={ref} style={{ height: '64px' }}>
        <div
          className={`d-flex flex-row align-items-center h-100 w-100 ${className}`}
        >
          {children}
        </div>
      </td>
    );
  }
);

export default memo(TableCell);
