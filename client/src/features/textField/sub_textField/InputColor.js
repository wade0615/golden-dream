import { useState, useEffect, forwardRef } from 'react';
import Form from 'react-bootstrap/Form';
import { Stack } from 'react-bootstrap';

const InputColor = forwardRef(
  (
    {
      type = 'text',
      label = 'label',
      hookProps = {},
      isValid = false,
      fieldWidth = '',
      ...rest
    },
    ref
  ) => {
    const {
      field,
      fieldState: { error }
    } = hookProps;
    const isInvalid = !!error?.type && !isValid;

    const [color, setColor] = useState('');

    useEffect(() => {
      if (field.value) {
        setColor(`#${field.value}`);
      } else {
        setColor('');
      }
    }, [field.value]);

    return (
      <Stack direction='horizontal'>
        <span className='me-2'>#</span>
        <Form.Control
          className='me-2'
          //   id={field.name}
          name={field.name}
          type={type}
          isInvalid={isInvalid}
          isValid={isValid}
          autoComplete={rest?.autocomplete ?? 'off'}
          placeholder='限6碼色碼'
          maxLength={6} // 限制最多只能輸入6個字符
          style={{ width: fieldWidth }}
          {...field}
          {...rest}
          ref={ref}
          onChange={(e) => {
            const newValue = e.target.value.slice(0, 6); // 限制長度為6
            if (newValue) {
              setColor(`#${newValue}`); // 如果有值，添加 '#' 並更新顯示顏色
            } else {
              setColor(''); // 如果沒有值，設置顏色為空
            }
            field.onChange(newValue); // 更新欄位值
          }}
        />
        <Form.Control
          style={{
            backgroundColor: color || '#ffffff', // 如果沒有色碼，則設為白色
            borderColor: isInvalid ? '#dc3545' : '#ced4da',
            // 如果背景是白色且無色碼，文字顏色可設為淺色，否則為白色
            color: !color || color === '#ffffff' ? '#ced4da' : '#ffffff',
            width: '38px',
            cursor: 'default' // 設定游標為默認樣式，表明無法輸入
          }}
          readOnly // 設置為只讀，不可編輯
        />
      </Stack>
    );
  }
);

export default InputColor;
