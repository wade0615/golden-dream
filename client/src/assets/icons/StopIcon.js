const StopIcon = ({ size = '24', color = '#000' }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g clipPath='url(#clip0_840_124061)'>
      <path
        d='M12 2.5C6.48 2.5 2 6.98 2 12.5C2 18.02 6.48 22.5 12 22.5C17.52 22.5 22 18.02 22 12.5C22 6.98 17.52 2.5 12 2.5ZM4 12.5C4 8.08 7.58 4.5 12 4.5C13.85 4.5 15.55 5.13 16.9 6.19L5.69 17.4C4.63 16.05 4 14.35 4 12.5ZM12 20.5C10.15 20.5 8.45 19.87 7.1 18.81L18.31 7.6C19.37 8.95 20 10.65 20 12.5C20 16.92 16.42 20.5 12 20.5Z'
        fill={color}
      />
    </g>
  </svg>
);

export default StopIcon;
