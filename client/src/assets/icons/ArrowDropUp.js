import React from 'react';

function ArrowDropUp({ color = 'white', size = '24' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M7 14L12 9L17 14H7Z' fill={color} />
    </svg>
  );
}

export default ArrowDropUp;
