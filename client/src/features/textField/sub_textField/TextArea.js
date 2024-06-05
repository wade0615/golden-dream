import Form from 'react-bootstrap/Form';
import { TagChip } from 'components/chip';
import { useFormContext } from 'react-hook-form';
import { FormError } from 'components/form';

const TextArea = ({
  label = 'label',
  hookProps = {},
  isValid = false,
  options = [],
  fieldWidth = '',
  maxLength,
  lengthCount = false,
  isFeedBack = true,
  ...rest
}) => {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const { trigger } = useFormContext(); // 從 useFormContext 獲取 trigger 方法

  // 根據是否提供了 maxLength 和 lengthCount 的值來決定是否顯示字數統計
  const shouldShowLengthCount = lengthCount && maxLength !== undefined;

  const handleChipClick = async (chipValue) => {
    const textarea = document.getElementById(field.name); // 獲取文本框 DOM
    if (textarea) {
      const { value, selectionStart, selectionEnd } = textarea;
      const beforeText = value.substring(0, selectionStart);
      const afterText = value.substring(selectionEnd, value.length);
      const newValue = `${beforeText}{=${chipValue}=}${afterText}`;
      // 檢查新值是否超過最大長度限制
      // if (maxLength !== undefined && newValue.length > maxLength) {
      //   // 如果超出最大長度，選擇不更新，可以選擇截斷文本以符合最大長度
      //   // console.warn('無法添加，因為超出了最大字數限制！');
      //   return; // 不進行更新
      //   // newValue = newValue.substring(0, maxLength);
      // }
      field.onChange(newValue); // 更新表單值
      // 等待更新後再觸發該欄位的驗證
      await trigger(field.name);
      // 重新設定光標位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          selectionStart + chipValue.length + 4;
      });
    }
  };

  return (
    <div className='date-chip' style={{ position: 'relative' }}>
      {!!options && options.length > 0 && (
        <div className='chips pb-2'>
          {options.map((chip, idx) => (
            <TagChip
              key={idx}
              id={chip.value}
              label={chip.label}
              bgColor='var(--bs-primary)'
              rounded
              outline
              clickable={!rest?.disabled}
              onChipClick={handleChipClick} // 處理函數
            />
          ))}
        </div>
      )}
      <Form.Control
        as='textarea'
        id={field.name}
        name={field.name}
        type='textarea'
        isInvalid={!!error?.message && !isValid}
        isValid={isValid}
        style={{ width: fieldWidth }}
        maxLength={maxLength}
        {...field}
        {...rest}
      />
      {shouldShowLengthCount ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: fieldWidth
          }}
        >
          {/* 當有錯誤信息時顯示，否則不顯示任何內容 */}
          {isFeedBack && error ? (
            <FormError marginClass='mt-1'>{error.message}</FormError>
          ) : (
            <div style={{ flex: 1 }}></div>
          )}
          {/* 字數計數器，固定在最右邊 */}
          <div
            style={{
              color: '#7C7E84',
              whiteSpace: 'nowrap',
              fontSize: '13px',
              textAlign: 'right',
              flexShrink: 0
            }}
          >
            {field?.value?.length ?? 0} / {maxLength}
          </div>
        </div>
      ) : (
        <>
          {isFeedBack && error && (
            <FormError marginClass='mt-1'>{error.message}</FormError>
          )}
        </>
      )}
    </div>
  );
};

export default TextArea;
