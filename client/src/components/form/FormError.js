import { memo } from 'react';

function FormError({ children, marginClass = 'mt-2' }) {
  return <small className={`text-danger ${marginClass}`}>{children}</small>;
}

export default memo(FormError);
