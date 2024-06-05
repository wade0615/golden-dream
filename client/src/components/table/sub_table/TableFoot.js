import { memo } from 'react';

function TableFoot({ children, ...rest }) {
  return <tfoot {...rest}>{children}</tfoot>;
}

export default memo(TableFoot);
