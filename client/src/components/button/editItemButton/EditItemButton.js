import React, { useState } from 'react';
import { PenIcon } from 'assets/icons';
import { Button } from 'react-bootstrap';

function EditItemButton({
  onClick,
  hidden = false,
  disabled = false,
  className = '',
  buttonText = '編輯'
}) {
  const [hover, setHover] = useState(false);
  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);
  return (
    <Button
      variant='outline-primary'
      hidden={hidden}
      className={className}
      size='sm'
      disabled={disabled}
      onClick={onClick}
      type='button'
      style={{ minWidth: '74px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='d-flex align-items-center gap-2'>
        {buttonText}
        <PenIcon size='18' color={hover ? '#FFF' : '#2D4059'} />
      </div>
    </Button>
  );
}

export default EditItemButton;
