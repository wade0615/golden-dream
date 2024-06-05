import Form from 'react-bootstrap/Form';

const InputNumber = ({
  label = 'label',
  hookProps = {},
  isValid = false,
  fieldWidth = '',
  type = 'number',
  maxLength, // 預設為 undefined，即無上限
  ...rest
}) => {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const isInvalid = !!error?.message && !isValid;

  const handleChange = (e) => {
    let value = e.target.value;
    // 移除非數字字符
    value = value.replace(/[^0-9]/g, '');
    // 檢查長度
    if (maxLength !== undefined && value.length > maxLength) {
      value = value.substr(0, maxLength);
    }
    // 去除前導零，除非它是唯一的字符
    if (value !== '0') {
      value = value.replace(/^0+/, '');
    }
    // 空白處理和數字轉換
    value = value !== '' ? parseInt(value, 10).toString() : '';
    field.onChange(value);
  };

  return (
    <Form.Control
      {...field}
      //   id={field.name}
      name={field.name}
      type='number'
      isInvalid={isInvalid}
      isValid={isValid}
      autoComplete={rest?.autocomplete ?? 'off'}
      style={{ width: fieldWidth }}
      onChange={handleChange}
      // onChange={(e) => {
      //   const value = !!e.target.value ? e.target.value : '';
      //   return value.trim() !== ''
      //     ? field.onChange(parseInt(value, 10))
      //     : field.onChange('');
      // }}
      {...rest}
    />
  );
};

export default InputNumber;
