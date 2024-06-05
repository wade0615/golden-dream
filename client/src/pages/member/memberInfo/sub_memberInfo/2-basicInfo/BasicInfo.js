import { useEffect, useState, useContext, useRef } from 'react';
import { MemberInfoContext } from '../../MemberInfo';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatDefTimeNew } from 'utils/timeUtils';

import { useNavigate } from 'react-router-dom';

import api from 'services/api';
import CountryCodeArray from 'constants/countryCodeArray';
import alertService from 'utils/alertService';

import {
  Button,
  Stack,
  Form,
  InputGroup,
  Overlay,
  Popover
} from 'react-bootstrap';
import { DefaultLayout } from 'layout';
import TextField, { FieldGroup } from 'features/textField/TextField';
import OverlayButton from 'components/overlayButton/OverlayButton';
import Info from '../0-component/Info';

import '../../../addMember/addMemberStyle.scss';
// import { BsEyeFill } from 'react-icons/bs';
import PermissionAction from 'components/permissionAction/PermissionAction';
import AUTH_CODE from 'config/auth.code.config';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';

import ExceptionHandleService from 'utils/exceptionHandler';

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
  icp: [],
  mobile: '',
  tel: '',
  birth: '',
  gender: '',
  email: '',
  note: '',
  invoiceType: '',
  invoiceBarcode: '',
  referralCode: '',
  tagId: []
};

// form 驗證
const _schema = yup.object({
  name: yup
    .string()
    .required('請輸入正確姓名格式')
    .matches(/^[\u4E00-\u9FFFa-zA-Z\s.]+$/, '請輸入正確姓名格式')
    .min(2, '請輸入大於2位中英字')
    .max(30, '請輸入小於30位中英字'),
  birth: yup.string().required('請輸入生日'),
  zipCode: yup.string().required(' '),
  cityCode: yup.string().required(' '),
  address: yup.string().required('請輸入').max(50, '請輸入小於50個字'),
  tel: yup
    .string()
    .nullable()
    .matches(/^$|[()#\-0-9]+$/, '請輸入正確住家電話')
    .max(14, '請輸入小於14個數字與符號'),
  gender: yup.string().required('請選擇'),
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

/** 會員詳情 - 基本資料 */
function BasicInfo() {
  // const navigate = useNavigate();
  const [cityCodeOptions, setCityCodeOptions] = useState([]);
  const [zipCodeOptions, setZipCodeOptions] = useState([]);
  const [specialMemberTypeOption, setSpecialMemberTypeOption] = useState([]);
  const { currentTab, commonData, memberId } = useContext(MemberInfoContext);
  const [detailData, setDetailData] = useState({});
  const [tagOptions, setTagOptions] = useState([]); //選擇標籤下拉式選項
  const tagRef = useRef(null);
  const [showTagPopover, setShowTagPopover] = useState(false);
  const [isTagSelected, setIsTagSelected] = useState(true);
  const navigate = useNavigate();

  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  const hasReadPermission =
    Array.isArray(userInfo.authItems) &&
    userInfo.authItems.includes(AUTH_CODE.MEMBER.INFO.READ);
  const hasUpdatePermission =
    Array.isArray(userInfo.authItems) &&
    userInfo.authItems.includes(AUTH_CODE.MEMBER.INFO.CREATE_UPDATE);
  const isViewMode = hasReadPermission && !hasUpdatePermission;

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: _defaultValues,
    resolver: yupResolver(_schema)
  });

  const { reset } = methods;

  /* 監聽表單欄位是否更新  */
  const cityCodeWatch = methods.watch('cityCode');
  const zipCodeWatch = methods.watch('zipCode');

  /* 初始化: 取得縣市區下拉選單 ＆ 特殊會員類型下拉選單 */
  useEffect(() => {
    try {
      const getInit = async () => {
        const promises = [
          api.common.getTownshipCityData(),
          api.member.getMemberSpecialTypeMenu()
        ];
        if (!isViewMode) {
          promises.push(api.tag.getTagMenu());
        }
        const [data, data2, _tagData] = await Promise.all(promises);
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
        if (_tagData) {
          const _tagOptions = _tagData?.map(({ id, name }) => ({
            label: name,
            value: String(id)
          }));
          setTagOptions(_tagOptions);
        }
      };
      if (
        currentTab === 1 &&
        !cityCodeOptions.length &&
        !specialMemberTypeOption.length
      ) {
        getInit();
      }
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
    // eslint-disable-next-line
  }, [currentTab, cityCodeOptions, specialMemberTypeOption]);

  /* 取得會員詳細資料 */
  useEffect(() => {
    if (!cityCodeOptions.length || !memberId) return;
    const getMemberDetail = async (id) => {
      try {
        await api.member.getMemberDetail(id).then((data) => {
          const formateData = {
            memberSpecialType: data?.specialTypeCode ?? '',
            address: data?.address ?? '',
            name: data?.name ?? '',
            icp: [data?.mobileCountryCode ?? ''],
            mobile: data?.mobile ?? '',
            birth: data?.birthday ?? '',
            gender: data?.gender ?? '',
            email: data?.gmail ?? '',
            cityCode: data?.cityCode ?? '',
            zipCode: data?.zipCode ?? '',
            tel: data?.homePhone ?? '',
            invoiceBarcode: data?.carriersKey ?? '',
            invoiceType:
              data?.carriersKey?.length === 0
                ? '' //請選擇
                : data?.carriersKey?.length === 8
                  ? '0' // 手機條碼
                  : '1', // 自然人憑證
            note: data?.remark ?? '',
            referralCode: data?.referralCode ?? '',
            createTime: data?.createTime ?? '',
            tagId: []
          };
          reset(formateData);
          setDetailData(data);
        });
      } catch (error) {
        _EHS.errorReport(error, 'getMemberDetail', _EHS._LEVEL.ERROR);
      }
    };
    getMemberDetail(memberId);
    // eslint-disable-next-line
  }, [cityCodeOptions, memberId]);

  /* 重選縣市時，清空郵遞區號 */
  // useEffect(() => {
  //   methods.setValue('zipCode', '');
  // }, [cityCodeWatch, methods]);

  const handleReSendSms = async () => {
    const info = methods.getValues();
    const reqBody = {
      mobileCountryCode: info.icp[0],
      mobile: info.mobile,
      memberId
    };
    const res = await api.member.resendSms(reqBody);
    if (res) {
      alertService.toast({ title: '已重新發送驗證碼' });
      setDetailData((prev) => ({
        ...prev,
        smsInfo: {
          expireTime: res?.expire_time ?? '',
          verifyCode: res?.verify_code ?? ''
        }
      }));
    }
  };

  /* 送出表單 */
  const handleSubmit = async (data, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }

    const code = data.icp[0];
    e.preventDefault();
    const reqBody = {
      memberId: memberId ?? '',
      memberSpecialType: +data.memberSpecialType,
      name: data.name,
      mobileCountryCode: code ?? '',
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

    const res = await api.member.updMemberDetail(reqBody);
    if (res) {
      alertService.toast();
    }
  };

  /**
   * 重設密碼
   */
  const passwordMethods = useForm({
    mode: 'onBlur',
    defaultValues: {
      password: 'test'
    },
    resolver: yupResolver(
      yup.object({
        password: yup
          .string()
          .required('請輸入8碼內英數字、符號@$%^&=._')
          .matches(
            // /^[a-zA-Z0-9!@#$%^&*()-_=+\\|{}[\]:;"'<>,.?/]{1,8}$/,
            /^[a-zA-Z0-9@$%^&=._]{1,8}$/,
            '請輸入8碼內英數字、符號@$%^&=._'
          )
      })
    )
  });

  /* 預設密碼西元生日8碼 */
  const birthWatch = methods.watch('birth');
  const formatPassword = (date) => formatDefTimeNew(new Date(date), { formatString: 'yyyyMMdd' });
  useEffect(() => {
    if (!!birthWatch) {
      passwordMethods.reset({
        password: formatPassword(birthWatch)
      });
    }
  }, [birthWatch, passwordMethods]);

  const passwordSubmit = async (e) => {
    e.preventDefault();
    const isValid = await passwordMethods.trigger();
    if (!isValid) return;
    const info = methods.getValues();
    const newPwd = passwordMethods.getValues('password');
    const reqBody = {
      mobileCountryCode: info.icp[0],
      mobile: info.mobile,
      newPwd: newPwd
    };
    const res = await api.member.updateMemberPassword(reqBody);
    if (res) {
      alertService.toast({ title: '重置密碼成功' });
    }
  };

  /** 導轉積點調整頁面 */
  const handlePointAdjust = async () => {
    // URL 中，+ 號通常被解釋為空格 ( ) 的編碼
    const icp = commonData.mobileCountryCode.replace('+', ''); // 移除 + 號
    const mobile = commonData.mobile;
    const url = `/point/adjustList/add?&mode=add&icp=${icp}&mobile=${mobile}`;
    // 在新分頁中打開 URL
    window.open(url, '_blank');
    // navigate(`/point/adjustList/add?&mode=add&icp=${icp}&mobile=${mobile}`);
  };

  /* 前往兌換券發放新增頁面 */
  const handleCouponSendDetail = (couponType) => {
    // URL 中，+ 號通常被解釋為空格 ( ) 的編碼
    const icp = commonData.mobileCountryCode.replace('+', ''); // 移除 + 號
    const mobile = commonData.mobile;
    const baseUrl = `/coupon/couponsendinglist/`;
    const urlSuffix =
      couponType === 1
        ? `coupon?&mode=add&icp=${icp}&mobile=${mobile}`
        : `giftcard?&mode=add&icp=${icp}&mobile=${mobile}`;
    // 在新分頁中打開 URL
    window.open(baseUrl + urlSuffix, '_blank');
    // couponType === 1
    //   ? navigate(
    //       `/coupon/couponsendinglist/coupon?&mode=add&icp=${icp}&mobile=${mobile}`
    //     )
    //   : navigate(
    //       `/coupon/couponsendinglist/giftcard?&mode=add&icp=${icp}&mobile=${mobile}`
    //     );
  };

  /* 前往集點卡調整頁面 */
  const handleRewardCardAdjustInfo = () => {
    // URL 中，+ 號通常被解釋為空格 ( ) 的編碼
    const icp = commonData.mobileCountryCode.replace('+', ''); // 移除 + 號
    const mobile = commonData.mobile;
    const url = `/rewardCard/adjustmentlist/setting?&mode=add&icp=${icp}&mobile=${mobile}`;
    // 在新分頁中打開 URL
    window.open(url, '_blank');
    // navigate(`/rewardCard/adjustmentlist/setting?&mode=add&icp=${icp}&mobile=${mobile}`);
  };

  const handleAddMemberTag = async () => {
    const data = methods.getValues();
    // 檢查是否有選擇標籤
    if (!data.tagId || data.tagId.length === 0) {
      setIsTagSelected(false); // 沒有選擇標籤，設置為 false
      return; // 不執行後續操作
    }
    setIsTagSelected(true); // 有選擇標籤，設置為 true
    try {
      const convertObjArrayToNumArray = (objArray) => {
        return objArray.map((obj) => Number(obj.value));
      };
      const reqBody = {
        // action: 'ADD',
        tagIds: convertObjArrayToNumArray(data.tagId),
        mobileCountryCode: commonData.mobileCountryCode,
        mobile: commonData.mobile
      };
      const res = await api.tag.addTagMember(reqBody);
      setShowTagPopover(false);
      if (!!res?.msg) {
        console.log(res?.msg);
        return;
      }
      if (res) {
        await alertService.toast({ title: '新增成功' });
      }
    } catch (error) {
      _EHS.errorReport(error, 'handleAddMemberTag', _EHS._LEVEL.ERROR);
      // 處理錯誤情況
    }
  };

  const tagIdWatch = methods.watch('tagId');
  useEffect(() => {
    if (!isTagSelected && (tagIdWatch || tagIdWatch.length !== 0)) {
      setIsTagSelected(true); // 有選擇標籤，設置為 true
    }
    // eslint-disable-next-line
  }, [tagIdWatch]);

  function FieldErrorMsg({ text = '', marginClass = '', visible = true }) {
    return (
      <p
        className={`text-danger ${marginClass}`}
        style={{ fontSize: '14px', display: visible ? 'block' : 'none' }}
      >
        {text}
      </p>
    );
  }

  const handleCancel = () => {
    navigate('/member/list'); // 按取消不儲存回列表頁
  };

  if (currentTab !== 1) return null;
  return (
    <FormProvider {...methods}>
      <Form noValidate onSubmit={methods.handleSubmit(handleSubmit)}>
        <DefaultLayout.Outlet
          onCancel={handleCancel}
          disabledSaveBtn={isViewMode}
        >
          {/* 會員資訊共用區塊 */}
          <Info
            name={commonData?.name}
            mobile={`${commonData?.mobileCountryCode}-${commonData?.mobile}`}
            chips={[commonData?.membershipStatus, commonData?.specialTypeName]}
          >
            <PermissionAction authCode={AUTH_CODE.MEMBER.INFO.CREATE_UPDATE}>
              {/* 重設密碼 */}
              <OverlayButton
                label='重置密碼'
                resetFn={() =>
                  passwordMethods.reset({
                    password: formatPassword(birthWatch)
                  })
                }
              >
                <Form noValidate>
                  <Stack
                    gap={3}
                    className='justify-content-center align-items-center'
                    style={{ maxWidth: '260px' }}
                  >
                    <InputGroup size='sm'>
                      <Form.Control
                        name='password'
                        width='197px'
                        maxLength='8'
                        {...passwordMethods.register('password')}
                        autoComplete='off'
                        isInvalid={
                          !!passwordMethods?.formState?.errors?.password
                        }
                        isValid={!passwordMethods?.formState.errors?.password}
                      />
                      {/* <InputGroup.Text>
                        <BsEyeFill />
                      </InputGroup.Text> */}
                      {!passwordMethods?.formState?.errors?.password ? (
                        <Form.Text className='text-muted text-align-start w-100'>
                          8碼內英數字及符號
                        </Form.Text>
                      ) : (
                        <Form.Control.Feedback type='invalid'>
                          {
                            passwordMethods?.formState?.errors?.password
                              ?.message
                          }
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                    <Button type='button' onClick={passwordSubmit} size='sm'>
                      確定
                    </Button>
                  </Stack>
                </Form>
              </OverlayButton>
            </PermissionAction>
            <PermissionAction authCode={AUTH_CODE.TAG.BATCH.CREATE_UPDATE}>
              {/* <OverlayButton label='標籤設定'>標籤設定</OverlayButton> */}
              <div
                ref={tagRef}
              // onClick={() => setShowTagPopover(false)}
              >
                <Button
                  className='text-nowrap'
                  variant='outline-info'
                  size='sm'
                  onClick={() => setShowTagPopover(true)}
                >
                  標籤設定
                </Button>
              </div>
              <Overlay
                show={showTagPopover}
                target={tagRef.current}
                placement='bottom'
                rootClose
                rootCloseEvent='click'
                onHide={() => {
                  setShowTagPopover(false);
                }}
              >
                <Popover
                  id='tooltip-example'
                  style={{ width: '400px', maxWidth: '100%' }}
                >
                  <Popover.Body>
                    <div className='d-flex align-items-center'>
                      <TextField
                        name='tagId'
                        variant='chipSelect'
                        fieldWidth='374px'
                        options={tagOptions}
                        setOptions={setTagOptions}
                        isChipVertical
                      />
                    </div>
                    <FieldErrorMsg text={'請選擇'} visible={!isTagSelected} />
                    <div className='d-flex justify-content-center mt-2'>
                      <Button
                        type='button'
                        size='sm'
                        onClick={handleAddMemberTag}
                      >
                        確定
                      </Button>
                    </div>
                  </Popover.Body>
                </Popover>
              </Overlay>
            </PermissionAction>
            <PermissionAction
              authCode={AUTH_CODE.POINTS.ADJUSTMENT.CREATE_UPDATE}
            >
              <Button
                className='text-nowrap'
                variant='outline-info'
                size='sm'
                onClick={handlePointAdjust}
              >
                積點調整
              </Button>
            </PermissionAction>
            <PermissionAction
              authCode={AUTH_CODE.EXCHANGE.COUPON_ITEM_ISSUE.CREATE_UPDATE}
            >
              <Button
                className='text-nowrap'
                variant='outline-info'
                size='sm'
                onClick={() => handleCouponSendDetail(1)}
              >
                優惠券發放
              </Button>
            </PermissionAction>
            <PermissionAction
              authCode={AUTH_CODE.EXCHANGE.COUPON_ITEM_ISSUE.CREATE_UPDATE}
            >
              <Button
                className='text-nowrap'
                variant='outline-info'
                size='sm'
                onClick={() => handleCouponSendDetail(2)}
              >
                商品券發放
              </Button>
            </PermissionAction>
            <PermissionAction authCode={AUTH_CODE.CARD.ADJUST.CREATE_UPDATE}>
              <Button
                className='text-nowrap'
                variant='outline-info'
                size='sm'
                onClick={handleRewardCardAdjustInfo}
              >
                集點調整
              </Button>
            </PermissionAction>
          </Info>
          <div className='form-grid form-grid--2 mt-4'>
            {/* 會員卡號 */}
            <FieldGroup title='會員卡號'>
              <p className='pt-2'>{detailData?.cardNumber}</p>
            </FieldGroup>
            {/* 註冊時間 */}
            <FieldGroup title='註冊時間'>
              <p className='pt-2'>{detailData?.createTime}</p>
            </FieldGroup>
            {/* 特殊會員類型 */}
            <FieldGroup title='特殊會員類型' htmlFor='memberSpecialType'>
              <TextField
                variant='select'
                name='memberSpecialType'
                id='memberSpecialType'
                options={specialMemberTypeOption}
                disabled={isViewMode}
              />
            </FieldGroup>
            {/* 個人推薦碼 */}
            <FieldGroup title='個人推薦碼'>
              <p className='pt-2'>{detailData?.referralCode}</p>
            </FieldGroup>
            {/* 會員姓名 */}
            <FieldGroup title='會員姓名' required htmlFor='name'>
              <TextField name='name' maxLength='30' disabled={isViewMode} />
            </FieldGroup>
            {/* 居住地 */}
            <FieldGroup title='居住地' required htmlFor='cityCode'>
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
                  disabled={isViewMode}
                />
                <TextField
                  name='zipCode'
                  variant='select'
                  options={zipCodeOptions[cityCodeWatch]}
                  placeholder='選擇區域'
                  disabled={isViewMode}
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
                  options={CountryCodeArray}
                  disabled
                  readOnly
                />
                <TextField name='mobile' disabled readOnly />
                {(methods.formState.errors.icp ||
                  methods.formState.errors.mobile) && (
                    <p className='form-grid--error'>請輸入正確手機格式</p>
                  )}
              </div>
            </FieldGroup>
            {/* 詳細地址 */}
            <FieldGroup title='' htmlFor='address'>
              <TextField
                name='address'
                placeholder='詳細地址'
                disabled={isViewMode}
              />
            </FieldGroup>
            {/* 手機碼驗證 */}
            <FieldGroup title='手機碼驗證'>
              <Stack className='pt-1'>
                <div>
                  <span className='pe-4 pt-3'>
                    {detailData?.smsInfo?.verifyCode === ''
                      ? '-'
                      : detailData?.smsInfo?.verifyCode ?? '-'}
                  </span>
                  <Button
                    variant='outline-info'
                    size='sm'
                    onClick={handleReSendSms}
                    disabled={isViewMode}
                  >
                    重發驗證碼
                  </Button>
                </div>
                {!!detailData?.smsInfo?.expireTime && (
                  <span
                    className='text-body-secondary'
                    style={{ fontSize: '13px' }}
                  >
                    {'(' +
                      formatDefTimeNew(
                        new Date(detailData?.smsInfo?.expireTime),
                        {
                          formatString: 'yyyy/MM/dd HH:mm:ss'
                        }
                      ) +
                      ' 前有效)'}
                  </span>
                )}
              </Stack>
            </FieldGroup>
            {/* 住家電話 */}
            <FieldGroup title='住家電話' htmlFor='tel'>
              <TextField
                name='tel'
                placeholder='限14碼內'
                disabled={isViewMode}
              />
            </FieldGroup>
            {/* 生日 */}
            <FieldGroup title='生日' htmlFor='birth' required>
              <TextField
                variant='datePicker'
                name='birth'
                placeholder='YYYY/MM/DD'
                disabled={isViewMode}
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
                  disabled={isViewMode}
                />
                <TextField name='invoiceBarcode' disabled={isViewMode} />
              </div>
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
                disabled={isViewMode}
              />
            </FieldGroup>
            {/* 備註 */}
            <FieldGroup title='備註' htmlFor='note'>
              <TextField variant='textarea' name='note' disabled={isViewMode} />
            </FieldGroup>
            {/* Email */}
            <FieldGroup title='電子信箱' htmlFor='email'>
              <TextField name='email' type='mail' disabled={isViewMode} />
            </FieldGroup>
            <div />
            {/* 輸入推薦碼 */}
            <FieldGroup title='推薦人'>
              {(detailData?.recommenderCardNumber ||
                detailData?.recommenderCardNumber === '') && (
                  <p className='pt-2'>{`${detailData?.recommenderCardNumber ?? ''
                    } ${detailData?.recommenderName === ''
                      ? '-'
                      : detailData?.recommenderName
                    }`}</p>
                )}
            </FieldGroup>
          </div>
        </DefaultLayout.Outlet>
      </Form>
    </FormProvider>
  );
}

export default BasicInfo;
