import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatDefTimeNew } from 'utils/timeUtils';

import api from 'services/api';
import { icpArray } from 'constants/countryCodeArray';
import alert from 'utils/alertService';

import { Form } from 'react-bootstrap';
import TextField, { FieldGroup } from 'features/textField/TextField';
import { DefaultLayout } from 'layout';

import './addMemberStyle.scss';

import ExceptionHandleService from 'utils/exceptionHandler';
// import { DevTool } from '@hookform/devtools';

const _EHS = new ExceptionHandleService({
  _NAME: 'pages/member/addMember/AddMember.js',
  _NOTICE: ''
});

const _defaultValues = {
  memberSpecialType: '',
  name: '',
  zipCode: '',
  cityCode: '',
  address: '',
  icp: [], //autocomplete 預設值為陣列
  mobile: '',
  tel: '',
  birth: '',
  gender: '',
  email: '',
  note: '',
  invoiceType: '',
  invoiceBarcode: '',
  referralCode: ''
};

// form 驗證
const _schema = yup.object({
  name: yup
    .string()
    .required('請輸入正確姓名格式')
    .matches(/^[\u4E00-\u9FFFa-zA-Z]+$/, '請輸入正確姓名格式')
    .min(2, '請輸入大於2位中英字')
    .max(30, '請輸入小於30位中英字'),
  birth: yup.string().required('請輸入生日'),
  zipCode: yup.string().required(' '),
  cityCode: yup.string().required(' '),
  gender: yup.string().required('請選擇性別'),
  icp: yup.array().test('empty-check', ' ', (icp) => icp.length !== 0),
  mobile: yup.string().required(' ').min(7, ' ').max(11, ' '),
  tel: yup
    .string()
    .nullable()
    .matches(/^$|[()#\-0-9]+$/, '請輸入正確住家電話')
    .max(14, '請輸入小於14個數字與符號'),
  email: yup.string().email('請輸入正確email格式'),
  invoiceType: yup.string(),
  invoiceBarcode: yup
    .string()
    .when('invoiceType', {
      is: (val) => val === '0',
      then: () =>
        yup.string().matches(/^\/[0-9A-Z.+]{7}$/, '請輸入正確的手機條碼')
    })
    .when('invoiceType', {
      is: (val) => val === '1',
      then: () =>
        yup.string().matches(/^[A-Z]{2}\d{14}$/, '請輸入正確自然人憑證條碼')
    }),
  note: yup.string().max(300, '最多300字')
});

/** 新增會員 */
function AddMember() {
  const [cityCodeOptions, setCityCodeOptions] = useState([]);
  const [zipCodeOptions, setZipCodeOptions] = useState([]);
  const [specialMemberTypeOption, setSpecialMemberTypeOption] = useState([]);
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: _defaultValues,
    resolver: yupResolver(_schema)
  });

  /* 監聽表單欄位是否更新  */
  const cityCodeWatch = methods.watch('cityCode');
  const zipCodeWatch = methods.watch('zipCode');

  /* 初始化 */
  useEffect(() => {
    try {
      const getInit = async () => {
        const [data, data2] = await Promise.all([
          api.common.getTownshipCityData(),
          api.member.getMemberSpecialTypeMenu()
        ]);
        if (data) {
          const formatCityCode = data.map((code) => {
            return {
              value: code.cityCode,
              label: code.cityName
            };
          });

          const formatZipCode = data.reduce((acc, cur) => {
            let zips = cur.zips.map((code) => {
              return {
                value: code.zipCode,
                label: code.zipName
              };
            });
            return { ...acc, [cur.cityCode]: zips };
          }, {});
          setCityCodeOptions(formatCityCode);
          setZipCodeOptions(formatZipCode);
        }
        if (data2) {
          const formatType = data2.list.map((code) => ({
            label: code.name,
            value: code.seq
          }));
          setSpecialMemberTypeOption(formatType);
        }
      };
      getInit();
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
  }, []);

  /* 重選縣市時，清空郵遞區號 */
  // useEffect(() => {
  //   methods.setValue('zipCode', '');
  // }, [cityCodeWatch, methods]);

  /* 送出表單 */
  const handleSubmit = async (data, e) => {
    e.preventDefault();
    const reqBody = {
      specialTypeCode: data.memberSpecialType,
      name: data.name,
      mobileCountryCode: data.icp[0],
      mobile: data.mobile,
      birthday: formatDefTimeNew(new Date(data.birth)),
      gender: data.gender,
      email: data.email,
      cityCode: data.cityCode,
      zipCode: data.zipCode,
      address: data.address,
      homePhone: data.tel,
      carriersKey: data.invoiceBarcode,
      remark: data.note,
      inviteCode: data.referralCode
    };
    const res = await api.member.addMemberDetail(reqBody);
    if (res) {
      await alert
        .toast({ title: '新增會員成功' })
        .then(() => navigate('/member/list'));
    }
  };
  const handleGoBack = () => {
    navigate('/member/list');
  };

  return (
    <FormProvider {...methods}>
      {/* <DevTool control={methods.control} /> */}
      <Form onSubmit={methods.handleSubmit(handleSubmit)}>
        <DefaultLayout.Outlet onCancel={handleGoBack}>
          <div className='form-grid form-grid--2'>
            {/* 會員卡號 */}
            <FieldGroup title='會員卡號'>
              <p className='pt-2'>-</p>
            </FieldGroup>
            {/* 註冊時間 */}
            <FieldGroup title='註冊時間'>
              <p className='pt-2'>-</p>
            </FieldGroup>
            {/* 特殊會員類型 */}
            <FieldGroup title='特殊會員類型' htmlFor='memberSpecialType'>
              <TextField
                variant='select'
                name='memberSpecialType'
                id='memberSpecialType'
                options={specialMemberTypeOption}
              />
            </FieldGroup>
            {/* 個人推薦碼 */}
            <FieldGroup title='個人推薦碼'>
              <p className='pt-2'>-</p>
            </FieldGroup>
            {/* 會員姓名 */}
            <FieldGroup title='會員姓名' required htmlFor='name'>
              <TextField name='name' maxLength='30' />
            </FieldGroup>
            {/* 居住地 */}
            <FieldGroup title='居住地' required htmlFor='zipCode'>
              <div className='form-grid__address'>
                <TextField
                  name='cityCode'
                  variant='select'
                  options={cityCodeOptions}
                  placeholder='選擇縣市'
                  onChange={(e) => {
                    methods.setValue('cityCode', e.target.value);
                    methods.setValue('zipCode', '');
                  }}
                />
                <TextField
                  name='zipCode'
                  variant='select'
                  options={zipCodeOptions[cityCodeWatch]}
                  placeholder='選擇區域'
                />
                <p className='form-grid__address--code'>
                  {!!zipCodeWatch ? zipCodeWatch : '郵遞區號'}
                </p>
                {(methods.formState.errors.cityCode ||
                  methods.formState.errors.zipCode) && (
                  <p className='form-grid--error'>請輸入縣市區域</p>
                )}
              </div>
            </FieldGroup>
            {/*  手機號碼 */}
            <FieldGroup title='手機號碼' required htmlFor='mobile'>
              <div className='form-grid__mobile'>
                <TextField
                  name='icp'
                  variant='autocomplete'
                  options={icpArray}
                />

                <TextField name='mobile' placeholder='' />
                {(methods.formState.errors.icp ||
                  methods.formState.errors.mobile) && (
                  <p className='form-grid--error'>請輸入正確手機格式</p>
                )}
              </div>
            </FieldGroup>
            {/* 詳細地址 */}
            <FieldGroup title='' htmlFor='address'>
              <TextField name='address' placeholder='詳細地址' />
            </FieldGroup>
            {/* 生日 */}
            <FieldGroup title='生日' htmlFor='birth' required>
              <TextField
                variant='datePicker'
                name='birth'
                placeholder='YYYY/MM/DD'
              />
            </FieldGroup>
            {/* 住家電話 */}
            <FieldGroup title='住家電話' htmlFor='tel'>
              <TextField name='tel' placeholder='限14碼內' />
            </FieldGroup>
            {/* 性別 */}
            <FieldGroup title='性別' htmlFor='gender' required>
              <TextField
                variant='select'
                name='gender'
                options={[
                  { value: 'M', label: '男' },
                  { value: 'F', label: '女' },
                  { value: 'S', label: '保密' }
                ]}
              />
            </FieldGroup>
            {/* 發票載具 */}
            <FieldGroup title='發票載具' htmlFor='invoiceType'>
              <div className='form-grid__invoice'>
                <TextField
                  variant='select'
                  name='invoiceType'
                  options={[
                    { value: '0', label: '手機條碼' },
                    { value: '1', label: '自然人憑證條碼' }
                  ]}
                />
                <TextField name='invoiceBarcode' />
              </div>
            </FieldGroup>
            {/* Email */}
            <FieldGroup title='Email' htmlFor='email'>
              <TextField name='email' type='mail' />
            </FieldGroup>
            {/* 備註 */}
            <FieldGroup title='備註' htmlFor='note'>
              <TextField variant='textarea' name='note' />
            </FieldGroup>
            {/* 備註 */}
            <FieldGroup title='輸入推薦碼' htmlFor='referralCode'>
              <TextField name='referralCode' />
            </FieldGroup>
          </div>
        </DefaultLayout.Outlet>
      </Form>
    </FormProvider>
  );
}

export default AddMember;
