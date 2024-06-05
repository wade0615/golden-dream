import { Form, Stack } from 'react-bootstrap';
import { TagChip } from 'components/chip';

/**
 * @param {String} name input name **input name 傳入的 value 必須為 String ，不可為 Number
 * @param {Object} hookProps
 * @param {Boolean} isValid 是否通過驗證
 * @param {Array} options 選項 value, label, isOnly 選了其他選項，該選項即無法被選取
 * @param {Function} setOptions 設置下拉式選項
 * @param {String} fieldWidth 寬
 * @param {Function} deleteCallBackFn 刪除 chip 時的對外 func
 * @param {Boolean} allChipDisabled 是否 disabled chips
 * @param {Boolean} isChipVertical chips 是否要換行顯示
 * @returns
 */
function ChipSelect({
  hookProps = {},
  isValid = false,
  options = [],
  setOptions = (f) => f,
  fieldWidth = '220px',
  deleteCallBackFn = null,
  allChipDisabled = false,
  isChipVertical = false,
  outline = false,
  ...rest
}) {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const fieldValues = field?.value ?? [];
  const fieldValuesArr = !!fieldValues.length
    ? fieldValues?.reduce((acc, cur) => [...acc, cur.value], [])
    : [];

  const isInvalid = !!error?.message && !isValid;

  //  選擇 tags
  const handleChange = (val) => {
    const theSelected = options.find(
      (option) => String(option.value) === String(val)
    );
    const originalField = field?.value ?? [];
    field.onChange([...originalField, theSelected]);
  };

  //  刪除 tags
  const handleDelete = (val) => {
    const originalField = field?.value ?? [];
    const updateField = originalField.filter((ele) => ele.value !== val);
    field.onChange(updateField);
    deleteCallBackFn && deleteCallBackFn(val);
  };

  return (
    <Stack
      direction={isChipVertical ? 'vertical' : 'horizontal'}
      gap={2}
      className='date-chip'
    >
      <Form.Select
        id={field.name}
        ref={field.ref}
        isInvalid={isInvalid}
        isValid={isValid}
        onChange={(e) => handleChange(e.target.value)}
        disabled={options?.length === fieldValues?.length || rest?.disabled}
        onBlur={field.onBlur}
        {...rest}
        style={{ width: fieldWidth }}
      >
        <option value=''>{rest?.placeholder ?? '請選擇'}</option>
        {!!options.length &&
          options?.map((option, index) => {
            const isSelected = fieldValuesArr?.indexOf(option?.value) !== -1;
            if (isSelected) return null;
            return (
              <option
                key={`${index}-${option.value}`}
                value={option.value}
                disabled={option?.isOnly && !!fieldValues?.length} //option.isOnly ：選了其他選項，該選項即無法被選取
              >
                {option.label}
              </option>
            );
          })}
      </Form.Select>
      <div className='chips'>
        {!!fieldValues
          ? fieldValues?.map((chip, idx) => (
              <TagChip
                key={idx}
                id={chip.value}
                label={chip.label}
                bgColor='var(--bs-primary)'
                rounded
                hidden={allChipDisabled || chip?.disabled}
                onDelete={() => handleDelete(chip.value)}
                outline={outline}
                iconSize='16px'
              />
            ))
          : []}
      </div>
    </Stack>
  );
}

export default ChipSelect;
