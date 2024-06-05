import { memo, useRef } from 'react';
import { Form, Stack } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import InputGroup from 'react-bootstrap/InputGroup';
import { MdCalendarToday } from 'react-icons/md';

import { FormFeedback } from 'components/form';
import Flatpickr from 'react-flatpickr';
import '../../../../node_modules/flatpickr/dist/themes/light.css';
import { TagChip } from 'components/chip';
import flatpickrLocales from 'flatpickr/dist/l10n/zh-tw.js';

function DateChipPicker({
  hookProps = {},
  isValid = false,
  fieldWidth = '220px',
  options = {},
  allChipDisabled = false,
  ...rest
}) {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const { setValue, setError } = useFormContext();
  const isInvalid = !!error?.message && !isValid;

  // 將日曆改繁體中文
  const TraditionalMandarin = flatpickrLocales.zh_tw;
  const defaultOptions = {
    locale: TraditionalMandarin,
    dateFormat: 'Y/m/d'
  };

  const handleChange = (date) => {
    if (date) {
      // 檢查此日期是否已存在於列表中
      if (
        !field.value.some(
          (existingDate) => existingDate.getTime() === date.getTime()
        )
      ) {
        const updatedDates = [...field.value, date];
        // 對日期進行排序
        const sortedDates = updatedDates.sort(
          (a, b) => new Date(a) - new Date(b)
        );
        setValue(field.name, sortedDates, { shouldDirty: true });
        setError(field.name, '');
      }
    }
  };

  const fp = useRef(null);

  const handleDelete = (val) => {
    const updatedDates = field.value.filter((ele) => ele !== val);
    field.onChange(updatedDates);
  };

  function formatDateToCustomString(input) {
    let date;
    if (typeof input === 'string') {
      date = new Date(input);
    } else if (input instanceof Date) {
      date = input;
    } else {
      return ''; // 如果輸入不是可識別的日期或日期字串，則傳回空字串。
    }
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    };
    let formattedDate = date.toLocaleDateString('zh-TW', options);
    formattedDate = formattedDate.replace(/年|月/g, '/');
    formattedDate = formattedDate
      .replace(/週/g, '')
      .replace(/（/g, '(')
      .replace(/）/g, ')');
    return formattedDate;
  }

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
      <Stack direction={'vertical'} gap={2} className='date-chip'>
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
                    // id={field.name}
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
                <FormFeedback
                  type={!isValid ? 'invalid' : 'valid'}
                  errorMessage={error?.message}
                />
              </>
            );
          }}
          {...rest}
        />
        <div className='chips'>
          {!!field.value
            ? field.value.map((date, idx) => (
                <TagChip
                  key={idx}
                  id={date}
                  label={formatDateToCustomString(date)}
                  bgColor='var(--bs-primary)'
                  hidden={allChipDisabled || date?.disabled}
                  onDelete={() => handleDelete(date)}
                  iconSize='16px'
                  width='134px'
                />
              ))
            : []}
        </div>
      </Stack>
    </>
  );
}

export default memo(DateChipPicker);
