function AddIcon({ size = '20', color = '#457FE4' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M15.8333 10.8332H10.8333V15.8332H9.16663V10.8332H4.16663V9.1665H9.16663V4.1665H10.8333V9.1665H15.8333V10.8332Z'
        fill={color}
      />
    </svg>
  );
}

export default AddIcon;
