import { memo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { MdOutlineAccessTime } from 'react-icons/md';

import { FormFeedback, FormNote } from 'components/form';
import Flatpickr from 'react-flatpickr';
import '../../../../node_modules/flatpickr/dist/themes/light.css';
import flatpickrLocales from 'flatpickr/dist/l10n/zh-tw.js';

function TimePicker({
  label = 'label',
  hookProps = {},
  isValid = false,
  onClick = () => console.log('click'),
  isStart = false,
  isEnd = false,
  note = '',
  fieldWidth = '',
  options = {},
  onTimeChange,
  ...rest
}) {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const { setValue, setError } = useFormContext();

  const handleChange = (date) => {
    if (date) {
      const tempTime = new Date(date);
      setValue(field.name, tempTime, { shouldDirty: true });
      setError(field.name, '');
      if (onTimeChange) onTimeChange(tempTime); // 使用 onTimeChange 回調
    }
  };

  const fp = useRef(null);
  const isInvalid = !!error?.message && !isValid;

  // 將語言設為繁體中文
  const TraditionalMandarin = flatpickrLocales.zh_tw;

  const defaultOptions = {
    locale: TraditionalMandarin,
    enableTime: true, // 啟用時間選擇
    noCalendar: true, // 移除日曆，只顯示時間
    dateFormat: 'H:i', // 只顯示時間
    time_24hr: true, // 使用24小時制
    minuteIncrement: 1 // 分鐘增量
  };

  return (
    <>
      <style>
        {`
        .flatpickr-time .numInputWrapper span.arrowUp:after, 
        .flatpickr-time .numInputWrapper span.arrowDown:after {
          color: #008ec5;
        }`}
      </style>
      <Flatpickr
        ref={fp}
        value={field.value}
        options={{ ...defaultOptions, ...options }}
        onChange={([date]) => {
          handleChange(date);
        }}
        render={({ value, ...props }, ref) => {
          return (
            <>
              <InputGroup
                className='mb-1'
                hasValidation
                style={{ width: fieldWidth }}
              >
                <Form.Control
                  //   id={field.name}
                  name={field.value}
                  isInvalid={isInvalid}
                  isValid={isValid}
                  ref={ref}
                  {...props}
                  {...rest}
                />
                <InputGroup.Text
                  onClick={() => {
                    if (!fp?.current?.flatpickr) return;
                    fp.current.flatpickr.open();
                  }}
                >
                  <MdOutlineAccessTime />
                </InputGroup.Text>
                <FormFeedback
                  type={!isValid ? 'invalid' : 'valid'}
                  errorMessage={error?.message}
                />
              </InputGroup>
              <FormNote note={note} />
            </>
          );
        }}
        {...rest}
      />
    </>
  );
}

export default memo(TimePicker);
