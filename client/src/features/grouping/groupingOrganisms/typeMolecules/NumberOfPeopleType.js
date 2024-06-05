import { useWatch, useFormContext } from 'react-hook-form';
import { conditionOptions } from 'features/grouping/groupingConfig';

import { useGroupingContext } from '../../groupingHooks/grouping-hook';
import TextField from 'features/textField/TextField';

function NumberOfPeopleType({ name }) {
  const conditionAdultWatch = useWatch({ name: `${name}.adult.conditional` });
  const conditionChildWatch = useWatch({ name: `${name}.child.conditional` });
  const isBetween = (c) => c === 'BETWEEN';
  const { unregister, getValues } = useFormContext();
  const { disabled } = useGroupingContext();

  const handleUnregister = (val, type) => {
    if (!isBetween(val) && type === 'adult') {
      unregister(`${name}.adult.max`);
    } else if (!isBetween(val) && type === 'child') {
      unregister(`${name}.child.max`);
    }
  };

  return (
    <>
      {/* 成人 */}
      <TextField
        name={`${name}.adult.conditional`}
        variant='select'
        options={[...conditionOptions, { value: 'BETWEEN', label: '區間' }]}
        fieldWidth='100px'
        disabled={disabled}
        callBackFn={(val) => handleUnregister(val, 'adult')}
        formRules={{ required: { value: true, message: ' ' } }}
        data-recounting
      />
      <TextField
        name={`${name}.adult.min`}
        variant='number'
        fieldWidth='100px'
        disabled={disabled}
        formRules={{ required: { value: true, message: ' ' } }}
        data-recounting
      />
      <p>位成人，</p>
      {isBetween(conditionAdultWatch) && (
        <>
          <p>~</p>
          <TextField
            variant='number'
            name={`${name}.adult.max`}
            fieldWidth='100px'
            disabled={disabled}
            data-recounting
            formRules={{
              required: { value: true, message: ' ' },
              validate: {
                lessThanMin: (value) => {
                  return value > getValues(`${name}.adult.min`) || '不可小於';
                }
              }
            }}
          />
          <p>位成人，</p>
        </>
      )}
      {/* 兒童 */}
      <TextField
        name={`${name}.child.conditional`}
        variant='select'
        options={[...conditionOptions, { value: 'BETWEEN', label: '區間' }]}
        fieldWidth='100px'
        disabled={disabled}
        callBackFn={(val) => handleUnregister(val, 'child')}
        formRules={{ required: { value: true, message: ' ' } }}
        data-recounting
      />
      <TextField
        name={`${name}.child.min`}
        variant='number'
        fieldWidth='100px'
        disabled={disabled}
        formRules={{ required: { value: true, message: ' ' } }}
        data-recounting
      />
      <p>位兒童</p>
      {isBetween(conditionChildWatch) && (
        <>
          <p>~</p>
          <TextField
            variant='number'
            name={`${name}.child.max`}
            fieldWidth='100px'
            disabled={disabled}
            data-recounting
            formRules={{
              required: { value: true, message: ' ' },
              validate: {
                lessThanMin: (value) => {
                  return value > getValues(`${name}.child.min`) || '不可小於';
                }
              }
            }}
          />
          <p>位兒童</p>
        </>
      )}
    </>
  );
}

export default NumberOfPeopleType;
