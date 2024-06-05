import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from 'services/api';
import alertService from 'utils/alertService';
import { Form, Stack } from 'react-bootstrap';
import TextField, { FieldGroup } from 'features/textField/TextField';
import { DefaultLayout } from 'layout';
import FileUploadGroup from 'components/fileUploadGroup/FileUploadGroup';
import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/member/batchMembers/BatchMembers.js',
  _NOTICE: ''
});

/** 批量設定特殊會員 */
function BatchMembers() {
  const [specialTypeOptions, setSpecialTypeOptions] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [counts, setCounts] = useState(null);

  const methods = useForm({
    defaultValues: {
      type: 'ADD',
      specialTypeSeq: '',
      file: {}
    },
    resolver: yupResolver(
      yup.object({
        specialTypeSeq: yup.string().required('請選擇'),
        file: yup
          .mixed()
          .test('isEmpty', '請選擇檔案', (obj) => obj && obj instanceof File)
          .test('isErrorData', ' ', () => !errorMsg)
      })
    )
  });

  /*init 取得特殊會員下拉式選項  */
  useEffect(() => {
    const getInit = async () => {
      try {
        const res = await api.member.getMemberSpecialTypeMenu();
        if (res) {
          if (!res?.list?.length) return;
          const options = res.list.map((item) => ({
            label: item.name,
            value: item.seq
          }));
          setSpecialTypeOptions(options);
        }
      } catch (error) {
        _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
      }
    };
    getInit();
  }, []);

  const handleSubmit = async () => {
    const data = methods.getValues();
    const { file, type, specialTypeSeq } = data;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('specialTypeSeq', specialTypeSeq);
    const res = await api.member.updBatchMemberSpecialType(formData);
    if (res) {
      alertService.toast({ title: '上傳成功' });
    }
  };

  /* 下載範本 */
  // const demoDownloadExcel = () => {
  //   api.member
  //     .downloadMemberSpecialTypeExample()
  //     .then((blob) => {
  //       // 將原始 Blob 轉換為 ArrayBuffer
  //       blob.arrayBuffer().then((arrayBuffer) => {
  //         // 創建一個新的 Uint8Array，並且在開頭加上 UTF-8 的 BOM
  //         const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
  //         const data = new Uint8Array(arrayBuffer);
  //         const withBOM = new Uint8Array(BOM.length + data.length);
  //         withBOM.set(BOM, 0);
  //         withBOM.set(data, BOM.length);
  //         // 創建一個新的 Blob 物件，包含了 BOM
  //         const newBlob = new Blob([withBOM], {
  //           type: 'text/csv;charset=utf-8;'
  //         });
  //         // 使用新的 Blob 物件
  //         const url = URL.createObjectURL(newBlob);
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.setAttribute('download', `批量設定特殊會員_匯入範本.csv`);
  //         document.body.appendChild(link);
  //         link.click();
  //         URL.revokeObjectURL(url);
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // };

  // const handleCheckFormData = async () => {
  //   const file = methods.getValues('file');
  //   if (typeof file !== 'object') {
  //     setErrorMsg(null);
  //     setCounts(null);
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   const res = await api.member.chkUploadMemberMobile(formData);
  //   if (!!res?.msg) {
  //     const msgArr = res?.msg.split(splitStr);
  //     setErrorMsg(msgArr);
  //     setCounts(null);
  //     methods.setError('file', { type: 'custom', message: ' ' });
  //     return;
  //   }
  //   if (res) {
  //     setErrorMsg(null);
  //     setCounts(res?.totalCount ?? 0);
  //     methods.clearErrors('file');
  //   }
  // };

  return (
    <div className='grid mt-2'>
      <FormProvider {...methods}>
        {/* <DevTool {...methods} /> */}
        <Form
          noValidate
          className='h-100'
          onSubmit={methods.handleSubmit(handleSubmit)}
        >
          <DefaultLayout.Outlet onSaveText='上傳'>
            <FieldGroup required title='設定類型'>
              <Stack gap={2}>
                <TextField
                  name='type'
                  variant='radio'
                  options={[
                    { label: '新增', value: 'ADD' },
                    { label: '刪除', value: 'DEL' }
                  ]}
                />
                <TextField
                  name='specialTypeSeq'
                  variant='select'
                  placeholder='請選擇特殊會員類型'
                  options={specialTypeOptions}
                  fieldWidth='376px'
                />
              </Stack>
            </FieldGroup>
            <FieldGroup required title='會員名單'>
              <FileUploadGroup
                name='file'
                formDataName='file'
                acceptType='.CSV'
                uploadApi={api.member.chkUploadMemberMobile}
                downloadApi={api.member.downloadMemberSpecialTypeExample}
                uploadInfo={{
                  name: methods.getValues('file'),
                  count: counts,
                  errorMsg: errorMsg
                }}
                validation={methods}
                downloadText={'下載範本'}
                downloadFileText={'批量設定特殊會員_匯入範本.csv'}
                setErrorMsg={setErrorMsg}
                setCounts={setCounts}
              />
              {/* <Stack
                direction='horizontal'
                gap={2}
                className='align-items-start'
              >
                <TextField
                  type='file'
                  variant='fileUploader'
                  name='file'
                  accept='.CSV' // 只接受CSV檔
                  callBackFn={handleCheckFormData}
                />
                <Button
                  type='button'
                  variant='outline-info'
                  onClick={demoDownloadExcel}
                >
                  下載範本 <DownloadIcon />
                </Button>
              </Stack>
              <Stack className='mt-2' gap={1}>
                <p className='text-secondary' style={{ fontSize: '12px' }}>
                  檔案格式: .CSV; 上傳限制: 1個檔案, 大小限20MB
                </p>
                {!!counts && <p>共 1 個檔案，{counts} 筆資料</p>}
                {!!errorMsg && (
                  <Stack direction='horizontal' gap={4}>
                    {errorMsg.map((msg, i) => (
                      <p key={i} className='text-danger'>
                        {msg}
                      </p>
                    ))}
                  </Stack>
                )}
              </Stack> */}
            </FieldGroup>
          </DefaultLayout.Outlet>
        </Form>
      </FormProvider>
    </div>
  );
}

export default BatchMembers;
