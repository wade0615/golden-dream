import React from 'react';

function DownloadIcon({ color = '', size = '20' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M15.8333 7.5H12.5V2.5H7.49999V7.5H4.16666L9.99999 13.3333L15.8333 7.5ZM4.16666 15V16.6667H15.8333V15H4.16666Z'
        fill={color}
      />
    </svg>
  );
}

export default DownloadIcon;
