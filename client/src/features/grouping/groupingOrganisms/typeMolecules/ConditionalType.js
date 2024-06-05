import { useWatch, useFormContext } from 'react-hook-form';
import { conditionOptions } from 'features/grouping/groupingConfig';
import { useGroupingContext } from '../../groupingHooks/grouping-hook';

import TextField from 'features/textField/TextField';

function ConditionalType({ name, suffixText = '歲', isContainChild = false }) {
  const conditionWatch = useWatch({ name: `${name}.conditional` });
  const isBetween = (c) => c === 'BETWEEN';
  const { unregister, getValues } = useFormContext();
  const { disabled } = useGroupingContext();

  const handleUnregister = (val) => {
    if (!isBetween(val)) {
      unregister(`${name}.max`);
    }
  };

  return (
    <>
      <TextField
        name={`${name}.conditional`}
        variant='select'
        options={[...conditionOptions, { value: 'BETWEEN', label: '區間' }]}
        fieldWidth='100px'
        callBackFn={handleUnregister}
        disabled={disabled}
        formRules={{ required: { value: true, message: ' ' } }}
        data-recounting
      />
      <TextField
        name={`${name}.min`}
        variant='number'
        fieldWidth='100px'
        disabled={disabled}
        formRules={{ required: { value: true, message: ' ' } }}
        data-recounting
      />
      <p>{suffixText}</p>
      {isBetween(conditionWatch) && (
        <>
          <p>~</p>
          <TextField
            variant='number'
            name={`${name}.max`}
            fieldWidth='100px'
            disabled={disabled}
            data-recounting
            formRules={{
              required: { value: true, message: ' ' },
              validate: {
                lessThanMin: (value) => {
                  return value > getValues(`${name}.min`) || '不可小於';
                }
              }
            }}
          />
          <p>{suffixText}</p>
        </>
      )}
      {isContainChild && (
        <>
          <p>，是否需含兒童： </p>
          <TextField
            name={`${name}.containsChild`}
            variant='radio'
            data-recounting
            disabled={disabled}
            options={[
              { value: '', label: '皆可' },
              { value: 'YES', label: '是' },
              { value: 'NO', label: '否' }
            ]}
            formRules={{
              required: { value: true, message: ' ' }
            }}
          />
        </>
      )}
    </>
  );
}

export default ConditionalType;
