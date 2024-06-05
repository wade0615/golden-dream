import { memo } from 'react';
import { ImImage } from 'react-icons/im';

function TableNail({ alt = '', imgUrl = '' }) {
  return !imgUrl ? (
    <ImImage size={48} color={`var(--bs-gray-400)`} className='me-1' />
  ) : (
    <img className='nail' alt={alt} src={imgUrl} />
  );
}

export default memo(TableNail);
