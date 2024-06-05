import { memo } from 'react';
import Form from 'react-bootstrap/Form';

const _type = {
  invalid: 'invalid',
  valid: 'valid'
};

function FormFeedback({
  type = 'invalid',
  errorMessage = '',
  fineMessage = ''
}) {
  return (
    <Form.Control.Feedback type={_type[type]}>
      {type === _type.invalid ? errorMessage : fineMessage}
    </Form.Control.Feedback>
  );
}

export default memo(FormFeedback);
