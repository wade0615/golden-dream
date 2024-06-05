import { memo } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { DownloadIcon } from 'assets/icons';
import TextField from 'features/textField/TextField';
import { splitStr } from 'constants/resSplit';
import { useFormContext } from 'react-hook-form';

/**
 * Description 檔案上傳組件
 * @param {string} name - 檔案輸入欄位的名稱。
 * @param {string} formDataName - FormData 中檔案對應的鍵名。
 * @param {string} acceptType - 接受的檔案類型，例如 '.CSV'。
 * @param {Function} uploadApi - 執行檔案上傳的 API 函數。
 * @param {Function} downloadApi - 執行檔案下載的 API 函數。
 * @param {Object} [downloadApiReq] - 下載 API 需要的請求參數。
 * @param {Object} [additionalFormData] - 除檔案外，額外需要上傳的表單數據。
 * @param {Object} uploadInfo - 包含上傳檔案的資訊，如 URL、檔案名稱、計數和錯誤訊息。
 * @param {boolean} [disabled=false] - 是否禁用檔案輸入欄位。
 * @param {Object} validation - 來自 useForm 或 useFormContext 的表單控制方法。
 * @param {number} [uploadConfigSize=20] - 上傳檔案大小限制，預設20MB。
 * @param {string} [uploadLimitText='檔案格式: .CSV; 上傳限制: 1個檔案，大小限20MB'] - 顯示於組件下方的檔案限制說明文字。
 * @param {string} [downloadText='下載範本'] - 下載按鈕上的文字。
 * @param {string} [downloadFileText='OOXX_匯入範本.csv'] - 下載的檔案名稱。
 * @param {Function} setExcelUrlForAPI - 設置接收 API 給予的 URL 的方法。
 * @param {Function} setExcelUrl - 設置檔案 URL 的方法。
 * @param {Function} setErrorMsg - 設置錯誤訊息的方法。
 * @param {Function} setCounts - 設置檔案計數的方法。
 * @param {number} [groupGap=3] - 按鈕和輸入框之間的間隙。
 * @param {Object} [formRules] - 用於檔案輸入欄位的驗證規則。
 */
const FileUploadGroup = ({
  name = 'file',
  formDataName = 'file',
  acceptType,
  uploadApi,
  downloadApi,
  downloadApiReq,
  additionalFormData,
  uploadInfo,
  disabled = false,
  validation: propsValidation,
  uploadConfigSize = 20,
  uploadLimitText = `檔案格式: .CSV; 上傳限制: 1個檔案, 大小限${uploadConfigSize}MB`,
  downloadText = '下載範本',
  downloadFileText = 'OOXX_匯入範本.csv',
  setExcelUrlForAPI,
  setExcelUrl,
  setErrorMsg,
  setCounts,
  groupGap = 3,
  formRules
}) => {
  // 嘗試從 context 獲取 methods，如果不在 FormProvider 內部，則使用從 props 傳入的 methods
  let validation = propsValidation;
  try {
    const contextValidation = useFormContext();
    validation = contextValidation;
  } catch (error) {
    console.warn('=== FileUploadGroup 使用從 props 傳入的 validation 方法');
  }

  // 處理檔案上傳
  const handleUpload = async () => {
    const file = validation.getValues(name);
    if (typeof file !== 'object') {
      if (setExcelUrl) setExcelUrl(null);
      setErrorMsg(null);
      setCounts(null);
      return;
    }
    try {
      const formData = new FormData();
      formData.append(formDataName, file);
      // 加入額外的表單數據
      if (additionalFormData && typeof additionalFormData === 'object') {
        Object.keys(additionalFormData).forEach((key) => {
          formData.append(key, additionalFormData[key]);
        });
      }
      const res = await uploadApi(formData);
      if (!!res?.msg) {
        const msgArr = res?.msg.split(splitStr);
        if (setExcelUrl) setExcelUrl(null);
        setErrorMsg(msgArr);
        setCounts(null);
        validation.setError(name, { type: 'custom', message: ' ' });
        return;
      }
      if (res) {
        validation.setValue('fileName', file.name);
        validation.setValue('fileDataCount', res?.totalCount ?? 0);
        // if(setExcelUrl) setExcelUrl(res?.urls);
        if (setExcelUrlForAPI) setExcelUrlForAPI(res?.urls);
        if (setExcelUrl) setExcelUrl(null);
        setErrorMsg(null);
        setCounts(res?.totalCount ?? 0);
        validation.clearErrors(name);
      }
    } catch (error) {
      console.error(error);
      if (setExcelUrl) setExcelUrl(null);
      setErrorMsg(null);
      setCounts(null);
    }
  };

  // 處理範本下載
  const handleDownloadTemplate = async () => {
    try {
      // 檢查是否提供了 downloadApiReq，如果沒有，則不傳遞這個參數
      const blob = await (downloadApiReq
        ? downloadApi(downloadApiReq)
        : downloadApi());
      blob.arrayBuffer().then((arrayBuffer) => {
        const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
        const data = new Uint8Array(arrayBuffer);
        const withBOM = new Uint8Array(BOM.length + data.length);
        withBOM.set(BOM, 0);
        withBOM.set(data, BOM.length);
        const newBlob = new Blob([withBOM], {
          type: 'text/csv;charset=utf-8;'
        });
        const url = URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadFileText); // 使用外部傳入的檔名
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 根據 formRules 的存在來決定是否傳遞這個 prop
  const textFieldProps = {
    type: 'file',
    variant: 'fileUploader',
    name: name,
    accept: acceptType,
    callBackFn: handleUpload,
    disabled: disabled,
    imageUploaderConfig: {
      size: uploadConfigSize
    }
  };
  if (formRules) {
    textFieldProps.formRules = formRules;
  }

  return (
    <div>
      <Stack
        direction='horizontal'
        gap={groupGap}
        className='align-items-start'
      >
        <TextField {...textFieldProps} />
        <Button
          className='text-nowrap'
          type='button'
          variant='outline-info'
          onClick={handleDownloadTemplate}
        >
          {downloadText} <DownloadIcon />
        </Button>
      </Stack>
      <Stack className='mt-2'>
        <p className='text-secondary' style={{ fontSize: '12px' }}>
          {uploadLimitText} {/* 顯示檔案上傳限制的文本 */}
        </p>
        {/* 顯示檔案上傳相關信息 */}
        {uploadInfo.errorMsg &&
          uploadInfo.errorMsg.map((msg, i) => (
            <p key={i} className='text-danger' style={{ fontSize: '14px' }}>
              {msg}
            </p>
          ))}
      </Stack>
      <Stack direction='horizontal' className='mt-2'>
        {!!uploadInfo.count && <p>共 1 個檔案，{uploadInfo.count} 筆資料</p>}
        {uploadInfo.url && (
          <a href={uploadInfo.url} className='text-info mx-2'>
            {uploadInfo.name}
          </a>
        )}
      </Stack>
    </div>
  );
};

export default memo(FileUploadGroup);
