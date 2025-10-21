import { memo } from 'react';
import './tagStyle.scss';

function Tag({ children = 'tag', variant = 'tag--secondary' }) {
  return <div className={`tag ${variant}`}>{children}</div>;
}

export default memo(Tag);
