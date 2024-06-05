import { memo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { MdCalendarToday } from 'react-icons/md';
import { formatDefTimeNew } from 'utils/timeUtils';

import { FormFeedback, FormNote } from 'components/form';
import Flatpickr from 'react-flatpickr';
import '../../../../node_modules/flatpickr/dist/themes/light.css';
import flatpickrLocales from 'flatpickr/dist/l10n/zh-tw.js';

function DateRangePicker({
  label = 'label',
  hookProps = {},
  isValid = false,
  onClick = () => console.log('click'),
  isStart = false,
  isEnd = false,
  note = '',
  fieldWidth = '',
  options = {},
  onDateChange,
  ...rest
}) {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const { setValue, setError } = useFormContext();

  // 確保 minDate 和 maxDate 是 Date 物件
  if (typeof options.minDate === 'number') {
    options.minDate = formatDefTimeNew(new Date(options.minDate), {
      formatString: 'yyyy/MM/dd HH:mm'
    });
  }
  if (typeof options.maxDate === 'number') {
    options.maxDate = formatDefTimeNew(new Date(options.maxDate), {
      formatString: 'yyyy/MM/dd HH:mm'
    });
  }

  const handleChange = (date) => {
    if (date) {
      let tempDate = date;
      if (isStart)
        tempDate = formatDefTimeNew(tempDate, {
          isStart: true,
          formatString: 'yyyy/MM/dd HH:mm'
        });
      if (isEnd)
        tempDate = formatDefTimeNew(tempDate, {
          isStart: false,
          formatString: 'yyyy/MM/dd HH:mm'
        });
      setValue(field.name, tempDate, { shouldDirty: true });
      setValue(field.name, date);
      setError(field.name, '');
      // 如果提供了 onDateChange，調用它
      if (onDateChange) onDateChange(date);
    }
  };
  const fp = useRef(null);
  const isInvalid = !!error?.message && !isValid;

  // 將日曆改繁體中文
  const TraditionalMandarin = flatpickrLocales.zh_tw;

  const defaultOptions = {
    mode: 'range',
    locale: TraditionalMandarin,
    dateFormat: 'Y/m/d'
  };

  return (
    <>
      <style>
        {`
        .flatpickr-day.selected, 
        .flatpickr-day.startRange, 
        .flatpickr-day.endRange,
        .flatpickr-day.selected:hover, 
        .flatpickr-day.startRange:hover, 
        .flatpickr-day.endRange:hover {
          background: #008ec5;
          border-color: #008ec5;
        }`}
      </style>

      <Flatpickr
        ref={fp}
        value={field.value}
        options={{ ...defaultOptions, ...options }}
        onChange={(date) => {
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
                  <MdCalendarToday />
                </InputGroup.Text>
              </InputGroup>
              <FormNote note={note} />
              <FormFeedback
                type={!isValid ? 'invalid' : 'valid'}
                errorMessage={error?.message}
              />
            </>
          );
        }}
        {...rest}
      />
    </>
  );
}

export default memo(DateRangePicker);
