import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useGroupingContext } from '../../groupingHooks/grouping-hook';

import TextField from 'features/textField/TextField';

function ChipSelectType({ name, options = [], setOptions = (f) => f }) {
  const { setValue, getValues, watch } = useFormContext();
  const { disabled } = useGroupingContext();
  const watchIds = watch(`${name}.ids`);

  // 監控 ids 更新下拉式選單
  // TODO 下拉式選項消失
  useEffect(() => {
    setValue(`${name}.selectedOption`, '');
    // eslint-disable-next-line
  }, [watchIds]);

  // 新增至 ids
  const handleHiddenOption = (_, val) => {
    if (!val) return;
    const _ids = getValues(`${name}.ids`) ?? [];
    const _names = getValues(`${name}.names`) ?? [];
    const isExist = _ids?.findIndex((id) => id === val) !== -1;
    const _selectedOption = options.find((ele) => ele.value === val);
    console.log(isExist, _selectedOption);
    setValue(`${name}.ids`, !isExist ? [..._ids, val] : _ids);
    setValue(
      `${name}.names`,
      !isExist ? [..._names, _selectedOption.label] : _names
    );
  };

  return (
    <>
      <TextField
        name={`${name}.selectedOption`}
        variant='select'
        options={options}
        disabled={disabled}
        callBackFn={handleHiddenOption}
        fieldWidth='160px'
        data-recounting
      />
      <TextField
        name={`${name}.conditional`}
        variant='select'
        fieldWidth='160px'
        disabled={disabled}
        formRules={{ required: { value: true, message: ' ' } }}
        data-recounting
        options={[
          { value: 'AND', label: '選項為AND' },
          { value: 'OR', label: '選項為OR' }
        ]}
      />
    </>
  );
}

export default ChipSelectType;
