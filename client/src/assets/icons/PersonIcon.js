const PersonIcon = ({ size = '24', color = '#000' }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 12C14.4862 12 16.5 9.98625 16.5 7.5C16.5 5.01375 14.4862 3 12 3C9.51375 3 7.5 5.01375 7.5 7.5C7.5 9.98625 9.51375 12 12 12ZM12 14.25C8.99625 14.25 3 15.7575 3 18.75V21H21V18.75C21 15.7575 15.0037 14.25 12 14.25Z'
      fill={color}
    />
    <path
      d='M12 12C14.4862 12 16.5 9.98625 16.5 7.5C16.5 5.01375 14.4862 3 12 3C9.51375 3 7.5 5.01375 7.5 7.5C7.5 9.98625 9.51375 12 12 12ZM12 14.25C8.99625 14.25 3 15.7575 3 18.75V21H21V18.75C21 15.7575 15.0037 14.25 12 14.25Z'
      fill='white'
      fillOpacity='0.6'
    />
  </svg>
);

export default PersonIcon;
