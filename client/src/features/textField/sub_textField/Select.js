import { memo } from 'react';
import Form from 'react-bootstrap/Form';

function Select({
  name = 'select',
  label = '',
  hookProps = {},
  isValid = false,
  options = [],
  fieldWidth = '',
  fieldHeight = '',
  fieldBorder = '',
  isPlaceholder = true,
  callBackFn = null,
  ...rest
}) {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const isInvalid = !!error?.message && !isValid;
  const handleChange = (e) => {
    callBackFn && callBackFn(e.target.name, e.target.value);
    field.onChange(e.target.value);
  };
  return (
    <Form.Select
      //   id={field.name}
      name={field.name}
      isInvalid={isInvalid}
      isValid={isValid}
      {...field}
      {...rest}
      onChange={handleChange}
      style={{ width: fieldWidth, height: fieldHeight, border: fieldBorder }}
    >
      {isPlaceholder && (
        <option value=''>{rest?.placeholder ?? '請選擇'}</option>
      )}
      {options?.map((option, index) => (
        <option
          key={index}
          value={option.value}
          disabled={!!option?.disabled}
          hidden={!!option?.hidden}
        >
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
}

export default memo(Select);
