import { memo } from 'react';
import Form from 'react-bootstrap/Form';

function FormNote({ text = '' }) {
  return <Form.Text muted>{text}</Form.Text>;
}

export default memo(FormNote);
