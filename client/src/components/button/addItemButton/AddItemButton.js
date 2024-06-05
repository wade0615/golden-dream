import { AddIcon } from 'assets/icons';
import { Button } from 'react-bootstrap';

function AddItemButton({
  onClick,
  hidden = false,
  disabled = false,
  className = '',
  buttonText = '新增'
}) {
  return (
    <Button
      variant='info'
      hidden={hidden}
      className={className}
      size='sm'
      disabled={disabled}
      onClick={onClick}
      type='button'
      style={{ minWidth: '74px' }}
    >
      <div className='d-flex align-items-center gap-2'>
        <AddIcon size='18' color='#FFF' />
        {buttonText}
      </div>
    </Button>
  );
}

export default AddItemButton;
