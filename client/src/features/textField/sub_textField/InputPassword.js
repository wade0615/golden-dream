import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { InputGroup } from 'react-bootstrap';

// 藉由 type 控制 password(密碼隱藏)，text(密碼顯示)
const InputPassword = ({
  type = 'password',
  label = 'label',
  hookProps = {},
  isValid = false,
  fieldWidth = '',
  placeholderColor,
  ...rest
}) => {
  const [currentType, setCurrentType] = useState(type);
  const toggleVisibility = () => {
    setCurrentType(currentType === 'password' ? 'text' : 'password');
  };
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const isInvalid = !!error?.message && !isValid;
  return (
    <InputGroup className={isInvalid ? 'has-error' : ''}>
      <Form.Control
        // id={field.name}
        name={field.name}
        type={currentType}
        isInvalid={isInvalid}
        isValid={isValid}
        autoComplete={rest?.autocomplete ?? 'off'}
        style={{ width: fieldWidth }}
        className='custom-placeholder-color'
        {...field}
        {...rest}
      />
      <InputGroup.Text onClick={toggleVisibility}>
        {currentType === 'password' ? <BsEyeFill /> : <BsEyeSlashFill />}
      </InputGroup.Text>
      {isInvalid && (
        <Form.Control.Feedback type='invalid'>
          {error?.message}
        </Form.Control.Feedback>
      )}
    </InputGroup>
  );
};

export default InputPassword;
