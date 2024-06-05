import { memo, useState, useEffect, Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import { useFormContext } from 'react-hook-form';
import IndeterminateCheckbox from 'components/indeterminateCheckbox/IndeterminateCheckbox';
import classNames from 'classnames';

function Checkbox({
  name = 'checkbox',
  label = '',
  hookProps = {},
  isValid = false,
  fieldWidth = '',
  options = [],
  isCheckAllOption = false,
  callBackFn = null,
  ...rest
}) {
  const {
    field,
    fieldState: { error }
  } = hookProps;

  const isInvalid = !!error?.message && !isValid;
  const [checkedState, setCheckedState] = useState(
    options?.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.value]: field?.value?.find((value) => value === cur.value)
          ? true
          : false
      }),
      {}
    )
  );

  useEffect(() => {
    setCheckedState(
      options?.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.value]: field?.value?.find((value) => value === cur.value)
            ? true
            : false
        }),
        {}
      )
    );
  }, [field.value, options]);

  const methods = useFormContext();
  const checkWatch = methods.watch(field.name);

  const _totalOptionCounts = options.length;
  const _totalChecked = options.map((ele) => ele.value);

  const handleChange = (val, isChecked) => {
    setCheckedState((prev) => ({ ...prev, [val]: isChecked }));
    const originalChecked = field?.value ?? [];
    if (isChecked) {
      field.onChange([...originalChecked, val]);
      callBackFn && callBackFn([...originalChecked, val]);
    } else {
      field.onChange([...originalChecked.filter((ele) => ele !== val)]);
      callBackFn &&
        callBackFn([...originalChecked.filter((ele) => ele !== val)]);
    }
  };

  const handleToggleCheckAll = (e) => {
    if (e.target.checked) {
      methods.setValue(field.name, _totalChecked);
    } else {
      methods.setValue(field.name, []);
    }
  };
  return (
    <div
      className={classNames({
        'd-flex': rest?.inline ?? true,
        'flex-wrap': rest?.inline ?? true,
        'py-2': rest?.inline ?? true
      })}
      style={{ width: fieldWidth }}
    >
      {label && <p className='me-2'>{label}</p>}
      {isCheckAllOption && (
        <IndeterminateCheckbox
          label='全選'
          name={field.name}
          checked={checkWatch.length === _totalOptionCounts}
          indeterminate={
            checkWatch.length !== 0 && checkWatch.length < _totalOptionCounts
          }
          className='form-check-inline'
          onChange={handleToggleCheckAll}
          centered={false}
          {...rest}
        />
      )}
      {options?.map((option, i) => {
        return (
          <Fragment key={`${option?.value}`}>
            <Form.Check
              name={field.name}
              id={`${field.name}-${option?.value}`}
              type='checkbox' // Change type to checkbox
              inline={rest?.inline ?? true}
              onChange={(e) => handleChange(option?.value, e.target.checked)}
              onBlur={field.onBlur}
              isInvalid={isInvalid}
              isValid={isValid}
              label={option?.label}
              value={option?.value}
              checked={checkedState[option?.value] || false}
              {...rest}
            />
          </Fragment>
        );
      })}
    </div>
  );
}

export default memo(Checkbox);
