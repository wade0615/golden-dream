import React, { useRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useWatch } from 'react-hook-form';
import api from 'services/api';
import { validateImage } from 'utils/commonUtil';

import { FormUploader } from 'components/form';
import { ImageDelBtn } from 'assets/icons';

import ExceptionHandleService from 'utils/exceptionHandler';
const _EHS = new ExceptionHandleService({
  _NAME: 'features/imageUploader/ImageUploader.js',
  _NOTICE: ''
});

/**
 *
 * @param name filedName, bind with react-hook-form, default value must be array
 * @param imageUploaderConfig 圖片上傳config - type: 類型,count:數量, width: 圖片寬度(px), height: 圖片長度(px), size: 圖片大小(MB)
 *
 */

const ImageUploader = ({
  //   name = 'image',
  hookProps = {},
  isValid = false,
  callBackFn = null,
  imageUploaderConfig = {
    //預設 editor (尺寸無限制，僅1張)
    type: 'editor',
    count: 1,
    width: null,
    height: null,
    size: null
  },
  ...rest
}) => {
  const inputRef = useRef();

  const {
    field,
    fieldState: { error }
  } = hookProps;
  const filesWatch = useWatch({ name: field.name });
  const isInvalid = !!error?.message && !isValid;
  const [inValid, setInValid] = useState(isInvalid);

  useEffect(() => {
    setInValid(!!error?.message && !isValid);
  }, [error, isValid]);

  /** 上傳圖片 */
  const handleUploadImage = async (files) => {
    if (!Array.from(files).length) return;

    const totalCount = field?.value?.length ?? 0;
    if (Array.from(files).length + totalCount > imageUploaderConfig.count) {
      Swal.fire({
        icon: 'info',
        text: `圖片限制${imageUploaderConfig.count}張以內`
      });
      return;
    }

    const isAllImageValid = await validateImage({
      files,
      maxHeight: imageUploaderConfig.height,
      maxWidth: imageUploaderConfig.width,
      maxMb: imageUploaderConfig.size
    });

    if (!isAllImageValid) {
      inputRef.current.value = ''; // 重置 input 欄位的值
      return;
    }

    // 上傳
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      formData.append('imageUploadType', imageUploaderConfig.type);
      const res = await api.common.uploadImage(formData);
      if (res) {
        const originalFiles = field?.value ?? [];
        field.onChange([...originalFiles, ...res?.urls]);
      }
    } catch (error) {
      _EHS.errorReport(error, 'handleUploadImage', _EHS._LEVEL.ERROR);
    }
  };

  /** 刪除圖片 */
  const handleRemoveImg = (url) => {
    const newFiles = field.value.filter((item) => item !== url);
    field.onChange(newFiles);
  };

  return (
    <>
      {filesWatch?.map((p, i) => (
        <div key={i} className='image-wrapper'>
          <button
            type='button'
            className='delete-btn'
            hidden={rest?.disabled}
            onClick={() => handleRemoveImg(p)}
          >
            <ImageDelBtn />
          </button>

          <img src={p} alt='' />
        </div>
      ))}
      {!filesWatch?.length && (
        <>
          <FormUploader
            ref={inputRef}
            multiple={imageUploaderConfig.count > 1}
            type='file'
            accept='image/png, image/jpeg, image/png'
            onChange={handleUploadImage}
            isClear
            isInvalid={inValid}
            {...rest}
          />

          <ul className='image-note'>
            {imageUploaderConfig?.width && (
              <li>
                圖片尺寸：{imageUploaderConfig.width}px *{' '}
                {imageUploaderConfig.height}
                px
              </li>
            )}
            {imageUploaderConfig?.size && (
              <li>
                格式：JPG、JPEG、PNG / 檔案大小：{imageUploaderConfig.size}{' '}
                MB以下
              </li>
            )}
          </ul>
        </>
      )}
    </>
  );
};

export default ImageUploader;
