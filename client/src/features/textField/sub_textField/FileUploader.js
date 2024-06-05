import { useRef, useEffect, useState } from 'react';
import { FormUploader } from 'components/form';

const FileUploader = ({
  label = 'label',
  hookProps = {},
  isValid = false,
  callBackFn = null,
  ...rest
}) => {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const inputRef = useRef();
  const isInvalid = !!error?.message && !isValid;
  const [inValid, setInValid] = useState(isInvalid);
  useEffect(() => {
    setInValid(!!error?.message && !isValid);
  }, [error, isValid]);

  const handleFileChange = (files) => {
    field.onChange(files[0]);
    callBackFn && callBackFn();
    // 重置輸入欄位以允許相同檔案名的檔案被重新上傳
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  return (
    <>
      <FormUploader
        ref={inputRef}
        type='file'
        // id={field.name}
        name={field.name}
        onChange={handleFileChange}
        isInvalid={inValid}
        {...rest}
      />
    </>
  );
};

export default FileUploader;
