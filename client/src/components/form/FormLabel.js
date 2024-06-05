import { memo } from 'react';
import ToolTip from '../tooltip/ToolTip';
import { FormRequired } from 'components/form';
import { Form } from 'react-bootstrap';
function FormLabel({
  htmlFor = 'formLabel',
  children,
  required = false,
  toolTipText = '',
  toolTipDirection = 'right',
  ...rest
}) {
  return (
    <>
      <label htmlFor={htmlFor} {...rest}>
        {children}
        {required && <FormRequired />}
        {!!toolTipText && (
          <ToolTip id={htmlFor} placement={toolTipDirection}>
            {toolTipText}
          </ToolTip>
        )}
        <br />
        <Form.Text muted>{rest?.note}</Form.Text>
      </label>
    </>
  );
}

export default memo(FormLabel);
