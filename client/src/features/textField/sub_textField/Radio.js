import classNames from 'classnames';
import Form from 'react-bootstrap/Form';

function Radio({
  name = 'radio',
  label = '',
  hookProps = {},
  isValid = false,
  fieldWidth = '',
  externalValue,
  options = [],
  callBackFn = null,
  ...rest
}) {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const isInvalid = !!error?.message && !isValid;
  const handleChange = (e) => {
    field.onChange(e.target.value);
    callBackFn && callBackFn(e.target.value);
  };
  return (
    <div
      //   htmlFor={name}
      className='hstack h-100 py-2'
      style={{ width: fieldWidth }}
    >
      {label && <p className='me-2'>{label}</p>}
      <div>
        {options?.map((option, i) => (
          <Form.Check
            key={`${option.value}-${i}`}
            id={`${field.name}-${option?.value}`}
            type='radio'
            className={classNames({
              'pb-2': rest?.inline === false ? true : false
            })}
            inline={rest?.inline ?? true}
            onChange={handleChange}
            onBlur={field.onBlur}
            isInvalid={isInvalid}
            isValid={isValid}
            label={option.label}
            value={option.value}
            {...rest}
            disabled={option?.disabled ? true : rest?.disabled ? true : false}
            // checked={field.value === option.value}
            checked={
              externalValue
                ? externalValue === option.value
                : field.value === option.value
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Radio;
