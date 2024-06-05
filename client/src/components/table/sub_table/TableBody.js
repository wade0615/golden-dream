import { memo, forwardRef } from 'react';

const TableBody = forwardRef(({ children, ...rest }, ref) => {
  return (
    <tbody ref={ref} {...rest}>
      {children}
    </tbody>
  );
});

export default memo(TableBody);
