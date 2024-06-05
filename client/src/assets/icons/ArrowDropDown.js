function ArrowDropDown({ size = '24', color = '#fff' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M7 10L12 15L17 10H7Z' fill={color} />
    </svg>
  );
}

export default ArrowDropDown;
