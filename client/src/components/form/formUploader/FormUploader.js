import { forwardRef, useState } from 'react';
import classNames from 'classnames';
import { UploadIcon } from 'assets/icons';
import Form from 'react-bootstrap/Form';
import './formUploaderStyle.scss';
import { validateFile } from 'utils/commonUtil';

const FormUploader = forwardRef(
  (
    {
      type = 'file',
      name = 'upload',
      onChange = null,
      multiple = false,
      isInvalid = false,
      isClear = false,
      imageUploaderConfig = {
        size: null
      },
      ...rest
    },
    ref
  ) => {
    const [fileName, setFileName] = useState(null);
    const inputRef = ref;
    const handleClick = () => {
      if (!inputRef) return;
      inputRef.current.click();
    };
    const handleFileChange = async (event) => {
      const selectedFiles = event.target.files;

      const isAllImageValid = await validateFile({
        files: selectedFiles,
        maxMb: imageUploaderConfig.size
      });

      if (!isAllImageValid) {
        inputRef.current.value = ''; // 重置 input 欄位的值
        return;
      }

      setFileName(selectedFiles[0]?.name);
      onChange && onChange(selectedFiles); // 取得檔案
      isClear && setFileName(null);
    };
    return (
      <>
        <button
          className={classNames({
            uploader: true,
            'border-danger': isInvalid
          })}
          type='button'
          onClick={handleClick}
        >
          <div className='uploader__text'>
            <p className={classNames({ 'text-body-tertiary': !fileName })}>
              {fileName ?? '請選擇檔案'}
            </p>
          </div>
          <div className='uploader__icon'>
            <UploadIcon />
          </div>
        </button>
        <Form.Control
          name={name}
          //   id={name}
          type={type}
          isInvalid={isInvalid}
          className='uploader__input'
          onChange={(e) => handleFileChange(e)}
          multiple={multiple} // 只能選一個檔案
          ref={inputRef}
          {...rest}
        />
      </>
    );
  }
);

export default FormUploader;
