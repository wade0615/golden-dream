import { useWatch, useFormContext } from 'react-hook-form';
import { conditionOptions } from 'features/grouping/groupingConfig';

import { useGroupingContext } from '../../groupingHooks/grouping-hook';

import TextField from 'features/textField/TextField';
import { groupingConditionType } from 'features/grouping/groupingConstants/groupingConditionType';
import groupingActionType from 'constants/groupingActionType';

function ConditionalDateType({ name, suffixText = '天' }) {
  const conditionWatch = useWatch({ name: `${name}.conditional` });
  const { unregister, getValues } = useFormContext();
  const { disabled, actionType } = useGroupingContext();
  let frequencyOptions = [...conditionOptions];

  switch (actionType) {
    case groupingActionType.single:
      frequencyOptions.push({ value: 'SPECIFY', label: '指定日期' });
      break;
    case groupingActionType.regular:
      frequencyOptions.push({ value: 'EXPORT', label: '依匯出時間' });
      break;
    default:
      break;
  }
  const handleUnregister = (val) => {
    unregister(`${name}.min`);
    unregister(`${name}.start`);
    unregister(`${name}.end`);
  };

  return (
    <>
      <TextField
        name={`${name}.conditional`}
        variant='select'
        options={frequencyOptions}
        fieldWidth='160px'
        disabled={disabled}
        callBackFn={handleUnregister}
        formRules={{ required: { value: true, message: ' ' } }}
        data-recounting
      />
      {conditionWatch !== '' &&
        conditionWatch !== groupingConditionType.SPECIFY &&
        conditionWatch !== groupingConditionType.EXPORT && (
          <>
            <TextField
              name={`${name}.min`}
              variant='number'
              fieldWidth='100px'
              disabled={disabled}
              formRules={{ required: { value: true, message: ' ' } }}
              data-recounting
            />
            <p>{suffixText}</p>
          </>
        )}
      {actionType === groupingActionType.single &&
        conditionWatch === groupingConditionType.SPECIFY && (
          <>
            <TextField
              name={`${name}.start`}
              variant='datePicker'
              fieldWidth='160px'
              disabled={disabled}
              data-recounting
              formRules={{
                required: { value: true, message: ' ' }
              }}
            />
            <span>~</span>
            <TextField
              name={`${name}.end`}
              variant='datePicker'
              fieldWidth='160px'
              disabled={disabled}
              data-recounting
              formRules={{
                required: { value: true, message: ' ' },
                validate: {
                  lessThanMin: (value) => {
                    return (
                      new Date(value).getTime() >=
                        new Date(getValues(`${name}.start`)).getTime() ||
                      '不可小於'
                    );
                  }
                }
              }}
            />
          </>
        )}
    </>
  );
}

export default ConditionalDateType;
