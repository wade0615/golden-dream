import { memo } from 'react';
import './tagStyle.scss';

function Tag({ children = 'tag' }) {
  return <div className='tag'>{children}</div>;
}

export default memo(Tag);
