import { forwardRef } from 'react';
import FieldController from './sub_textField/FieldController';
import FieldGroup from './sub_textField/FieldGroup';

import './textFieldStyle.scss';
/* 1) import 元件 */
import {
  CheckBox,
  DatePicker,
  TimePicker,
  DateRangePicker,
  DateChipPicker,
  InputText,
  InputColor,
  InputPassword,
  Radio,
  Select,
  SingleCheckbox,
  TextArea,
  AutoComplete,
  FileUploader,
  InputNumber,
  ImageUploader,
  ChipSelect,
  AccordionCheckbox
} from './sub_textField';

/* 2)註冊 textFiled 種類 */
const _variantType = {
  checkbox: 'checkbox',
  datePicker: 'datePicker',
  timePicker: 'timePicker',
  dateRangePicker: 'dateRangePicker',
  dateChipPicker: 'dateChipPicker',
  text: 'text',
  radio: 'radio',
  select: 'select',
  singleCheckbox: 'singleCheckbox',
  textarea: 'textarea',
  autocomplete: 'autocomplete',
  fileUploader: 'fileUploader',
  number: 'number',
  imageUploader: 'imageUploader',
  chipSelect: 'chipSelect',
  password: 'password',
  accordionCheckbox: 'accordionCheckbox',
  inputColor: 'inputColor'
};

/* 3) 加入 元件 種類 */
// formRules: react hook form 簡易驗證規則：https://react-hook-form.com/docs/useform/register#options
const TextField = forwardRef(
  (
    {
      name = 'name',
      variant = 'text',
      label = '',
      note = '',
      isValid = false,
      fineMessage = '',
      renderComponent,
      className = '',
      formRules = {},
      callBackFn = null,
      deleteCallBackFn = null,
      fieldWidth = '',
      isFeedBack = true,
      dateOptions = {},
      imageUploaderConfig,
      allChipDisabled = false,
      isPlaceholder = true,
      isCheckAllOption = false,
      enableTime = false,
      externalValue,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        <FieldController
          name={name}
          label={label}
          isValid={isValid}
          fineMessage={fineMessage}
          note={note}
          formRules={formRules}
          required={!!rest?.required}
          isFeedBack={isFeedBack}
          className={className}
          renderComponent={(props) => {
            switch (variant) {
              case _variantType.checkbox:
                return (
                  <CheckBox
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    isCheckAllOption={isCheckAllOption}
                    callBackFn={callBackFn}
                    {...rest}
                  />
                );
              case _variantType.datePicker:
                return (
                  <DatePicker
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    options={dateOptions}
                    enableTime={enableTime}
                    {...rest}
                  />
                );
              case _variantType.timePicker:
                return (
                  <TimePicker
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    options={dateOptions}
                    {...rest}
                  />
                );
              case _variantType.dateRangePicker:
                return (
                  <DateRangePicker
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    options={dateOptions}
                    {...rest}
                  />
                );
              case _variantType.dateChipPicker:
                return (
                  <DateChipPicker
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    options={dateOptions}
                    allChipDisabled={allChipDisabled}
                    {...rest}
                  />
                );

              case _variantType.text:
                return (
                  <InputText
                    isValid={isValid}
                    hookProps={props}
                    fieldWidth={fieldWidth}
                    isFeedBack={isFeedBack}
                    ref={ref}
                    options={rest?.options}
                    {...rest}
                  />
                );
              case _variantType.number:
                return (
                  <InputNumber
                    isValid={isValid}
                    hookProps={props}
                    fieldWidth={fieldWidth}
                    {...rest}
                  />
                );
              case _variantType.radio:
                return (
                  <Radio
                    name={name}
                    label={label}
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    externalValue={externalValue}
                    callBackFn={callBackFn}
                    {...rest}
                  />
                );
              case _variantType.select:
                return (
                  <Select
                    label={label}
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    callBackFn={callBackFn}
                    isPlaceholder={isPlaceholder}
                    {...rest}
                  />
                );
              case _variantType.chipSelect:
                return (
                  <ChipSelect
                    label={label}
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    deleteCallBackFn={deleteCallBackFn}
                    allChipDisabled={allChipDisabled}
                    options={rest?.options}
                    setOptions={rest?.setOptions}
                    {...rest}
                  />
                );
              case _variantType.textarea:
                return (
                  <TextArea
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    options={rest?.options}
                    isFeedBack={isFeedBack}
                    {...rest}
                  />
                );
              case _variantType.singleCheckbox:
                return (
                  <SingleCheckbox
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    label={label}
                    {...rest}
                  />
                );
              case _variantType.autocomplete:
                return (
                  <AutoComplete
                    fieldWidth={fieldWidth}
                    isValid={isValid}
                    hookProps={props}
                    {...rest}
                  />
                );
              case _variantType.fileUploader:
                return (
                  <FileUploader
                    isValid={isValid}
                    hookProps={props}
                    callBackFn={callBackFn}
                    imageUploaderConfig={imageUploaderConfig}
                    {...rest}
                  />
                );
              case _variantType.imageUploader:
                return (
                  <ImageUploader
                    isValid={isValid}
                    hookProps={props}
                    callBackFn={callBackFn}
                    imageUploaderConfig={imageUploaderConfig}
                    {...rest}
                  />
                );
              case _variantType.password:
                return (
                  <InputPassword
                    isValid={isValid}
                    hookProps={props}
                    fieldWidth={fieldWidth}
                    {...rest}
                  />
                );
              case _variantType.accordionCheckbox:
                return (
                  <AccordionCheckbox
                    isValid={isValid}
                    fieldWidth={fieldWidth}
                    hookProps={props}
                    {...rest}
                  />
                );
              case _variantType.inputColor:
                return (
                  <InputColor
                    fieldWidth={fieldWidth}
                    isValid={isValid}
                    hookProps={props}
                    ref={ref}
                    {...rest}
                  />
                );
              default:
                return (
                  <InputText
                    isValid={isValid}
                    hookProps={props}
                    fieldWidth={fieldWidth}
                    isFeedBack={isFeedBack}
                    ref={ref}
                    options={rest?.options}
                    {...rest}
                  />
                );
            }
          }}
        />
      </>
    );
  }
);

export { FieldGroup, FieldController };
export default TextField;
