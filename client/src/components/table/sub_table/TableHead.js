import { memo } from 'react';

function TableHead({ children, ...rest }) {
  return (
    <thead className='table-light' {...rest}>
      {children}
    </thead>
  );
}

export default memo(TableHead);
