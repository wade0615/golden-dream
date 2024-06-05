const KeyIcon = ({ size = '24', color = '#000' }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g clipPath='url(#clip0_10363_811)'>
      <path
        d='M12.65 10C11.83 7.67 9.61 6 7 6C3.69 6 1 8.69 1 12C1 15.31 3.69 18 7 18C9.61 18 11.83 16.33 12.65 14H17V18H21V14H23V10H12.65ZM7 14C5.9 14 5 13.1 5 12C5 10.9 5.9 10 7 10C8.1 10 9 10.9 9 12C9 13.1 8.1 14 7 14Z'
        fill={color}
      />
    </g>
    <defs>
      <clipPath id='clip0_10363_811'>
        <rect width={size} height={size} fill='white' />
      </clipPath>
    </defs>
  </svg>
);

export default KeyIcon;
