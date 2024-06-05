import { forwardRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const popover = (content) => (
  <Popover id='tooltip-example'>
    <Popover.Body>{content}</Popover.Body>
  </Popover>
);

const OverlayButton = forwardRef(
  (
    {
      children,
      variant = 'outline-info',
      size = 'sm',
      label = '點擊',
      type = 'button',
      resetFn = null,
      width = ''
    },
    ref
  ) => {
    const [show, setShow] = useState(false);
    const handleToggle = () => {
      setShow((prev) => !prev);
    };

    const handleClose = () => {
      handleToggle();
      resetFn && resetFn();
    };
    return (
      <>
        <OverlayTrigger
          trigger='click'
          placement='bottom'
          overlay={popover(children)}
          show={show}
          onToggle={handleClose}
        >
          <Button
            className='text-nowrap'
            variant={variant}
            type={type}
            size={size}
            style={{ zIndex: show ? 11 : 9 }}
          >
            {label}
          </Button>
        </OverlayTrigger>
        {show && (
          <div
            onClick={handleToggle}
            className=' position-fixed top-0 start-0 w-100 h-100'
            style={{ zIndex: 10 }}
          />
        )}
      </>
    );
  }
);

export default OverlayButton;
