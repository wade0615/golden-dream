import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function GroupingModal({
  title = 'modal',
  show = false,
  handleCancel = (f) => f,
  handleAdd = (f) => f,
  children = null
}) {
  return (
    <Modal
      className='table-modal'
      show={show}
      backdrop='static'
      keyboard={false}
      dialogClassName='modal-90w'
      onHide={handleCancel}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer className='justify-content-center'>
        <Button variant='outline-primary' type='button' onClick={handleCancel}>
          取消
        </Button>
        <Button type='button' onClick={handleAdd} data-recounting>
          確定新增
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GroupingModal;
