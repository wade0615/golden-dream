import { groupingDataType } from 'features/grouping/groupingConstants/groupingDataType';
import TextField from 'features/textField/TextField';
import { useGroupingContext } from '../../groupingHooks/grouping-hook';

function CheckboxType({ name, type, options = [] }) {
  const { disabled } = useGroupingContext();
  if (!name) return null;
  return (
    <>
      <TextField
        variant='checkbox'
        name={`${name}.${groupingDataType.ids}`}
        options={options}
        disabled={disabled}
        formRules={{ required: { value: true, message: '請選擇' } }}
        data-recounting
      />
      {/* <TextField readOnly name={`${name}.idsText`}></TextField> */}
    </>
  );
}

export default CheckboxType;
