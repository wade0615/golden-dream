import { memo, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';

const IndeterminateCheckbox = ({
  name = 'name',
  indeterminate,
  checked,
  className = '',
  label = '',
  centered = true,
  ...rest
}) => {
  const ref = useRef();
  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref) {
      ref.current.indeterminate = !checked && indeterminate;
    }
  }, [indeterminate, ref, checked]);
  const centeredClasses = centered ? 'ms-2 mt-1' : '';

  return (
    <Form.Check
      id={name}
      checked={checked}
      className={`${centeredClasses} ${className}`}
      type='checkbox'
      ref={ref}
      label={label}
      {...rest}
    />
  );
};

export default memo(IndeterminateCheckbox);
