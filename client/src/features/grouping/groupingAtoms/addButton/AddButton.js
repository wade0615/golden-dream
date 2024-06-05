import { memo } from 'react';
import { Button } from 'react-bootstrap';

function AddButton({ onClick = (f) => f, ...rest }) {
  return (
    <Button variant='outline-info mt-2' size='sm' {...rest} onClick={onClick}>
      ＋ 新增
    </Button>
  );
}

export default memo(AddButton);
