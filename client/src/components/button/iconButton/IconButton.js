import classNames from 'classnames';
import './iconButtonStyle.scss';

import { FaRegFaceDizzy } from 'react-icons/fa6';

function IconButton({
  children = null,
  iconColor = '(var--bs-black)',
  hoverBackground = '#e9ecef',
  iconSize = '1.25rem',
  onClick = (f) => f,
  ...rest
}) {
  return (
    <button
      className={classNames({ 'icon-button': true, disabled: rest?.disabled })}
      {...rest}
      onClick={!rest?.disabled ? onClick : (f) => f}
      style={{ '--hover-background': hoverBackground }}
    >
      {children ?? <FaRegFaceDizzy fill={iconColor} size={iconSize} />}
    </button>
  );
}

export default IconButton;
