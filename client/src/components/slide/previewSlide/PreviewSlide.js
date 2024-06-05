import React from 'react';
import { Offcanvas } from 'react-bootstrap';

function PreviewSlide({
  show = false,
  setShow = (f) => f,
  children,
  closeCallBackFn = (f) => f,
  backgroundColor = '#FFFFFF',
  ...rest
}) {
  const handleClose = () => {
    setShow(false);
    closeCallBackFn();
  };
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement='end'
      style={{ width: '375px', backgroundColor: backgroundColor }}
      {...rest}
    >
      {show && (
        <>
          <Offcanvas.Header closeButton className='border-bottom'>
            <Offcanvas.Title>預覽</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className='p-0'>{children}</Offcanvas.Body>
        </>
      )}
    </Offcanvas>
  );
}

export default PreviewSlide;
