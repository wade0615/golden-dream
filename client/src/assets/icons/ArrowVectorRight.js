import React from 'react';

function ArrowVectorRight({ color = 'black', size = '12' }) {
  return (
    <svg
      width={(size / 3) * 2}
      height={size}
      viewBox={`0 0 ${(size / 3) * 2} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M0.589844 10.59L5.16984 6L0.589844 1.41L1.99984 0L7.99984 6L1.99984 12L0.589844 10.59Z'
        fill={color}
      />
    </svg>
  );
}

export default ArrowVectorRight;
