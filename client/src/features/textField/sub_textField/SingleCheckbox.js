import { memo } from 'react';
import Form from 'react-bootstrap/Form';

function SingleCheckbox({
  label = 'label',
  hookProps = {},
  isValid = false,
  checked = false,
  fieldWidth = '',
  ...rest
}) {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const isInvalid = !!error?.message && !isValid;
  return (
    <Form.Check
      width={fieldWidth}
      id={field.name}
      label={label}
      onChange={(e) => field.onChange(e.target.checked)}
      checked={Boolean(field.value)}
      isInvalid={isInvalid}
      isValid={isValid}
      {...field}
      {...rest}
    />
  );
}

export default memo(SingleCheckbox);
