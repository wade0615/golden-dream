import { memo, forwardRef } from 'react';

const TableRow = forwardRef(({ children, isEditing = false, ...rest }, ref) => {
  return (
    <tr ref={ref} {...rest}>
      {children}
    </tr>
  );
});
export default memo(TableRow);
