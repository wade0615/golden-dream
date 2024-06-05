import { memo, useState } from 'react';
import { Stack } from 'react-bootstrap';
import './RadioButtonGroupStyle.scss';

function RadioButtonGroup({
  options = [{ value: 'radio', label: 'radio' }],
  name = 'radioButtonGroup',
  onChange = (f) => f,
  defaultChecked = '',
  ...rest
}) {
  const [selectedValue, setSelectedValue] = useState(defaultChecked);
  const handleChange = (val) => {
    setSelectedValue(val);
    onChange(val);
  };
  return (
    <Stack direction='horizontal'>
      {options?.map((option) => (
        <div className='radio-button' key={option.value}>
          <input
            type='radio'
            id={option.value}
            name={name}
            value={option.value}
            onChange={(e) => handleChange(e.target.value)}
            checked={option.value === selectedValue}
            {...rest}
          />
          <label className='btn btn-default' htmlFor={option.value}>
            {option.label}
          </label>
        </div>
      ))}
    </Stack>
  );
}

export default memo(RadioButtonGroup);
