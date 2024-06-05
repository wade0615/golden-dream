import { Typeahead } from 'react-bootstrap-typeahead';

/* 使用參考: https://ericgio.github.io/react-bootstrap-typeahead/ */
function AutoComplete({
  label = 'label',
  hookProps = {},
  isValid = false,
  options = [],
  fieldWidth = '',
  ...rest
}) {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const isInvalid = !!error?.message && !isValid;
  //   const handleChange = (val) => {
  //     console.log(val);
  //   };
  return (
    <Typeahead
      style={{ width: fieldWidth }}
      id={field.name}
      name={field.name}
      selected={field.value}
      options={options}
      isInvalid={isInvalid}
      isValid={isValid}
      autoComplete={rest?.autocomplete ?? 'off'}
      {...field}
      {...rest}
    />
  );
}

export default AutoComplete;
