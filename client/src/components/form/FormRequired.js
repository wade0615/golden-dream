import { memo } from 'react';

function FormRequired({ text = '*' }) {
  return <span className='text-danger'>{text}</span>;
}

export default memo(FormRequired);
