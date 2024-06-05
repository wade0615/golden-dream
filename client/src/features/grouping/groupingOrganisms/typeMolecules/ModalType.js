import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import api from 'services/api';
import { groupingModalType as _type } from '../../groupingConstants/groupingModalType';
import { useGroupingContext } from '../../groupingHooks/grouping-hook';

import TextField from 'features/textField/TextField';
import { PointModal } from './sub_typeMolecules/modals';
import StoreModal from 'pages/coupon/sub_coupon/storeModal/StoreModal';
import CouponModal from 'pages/coupon/sub_coupon/couponModal/CouponModal';
import ProductModal from 'pages/coupon/sub_coupon/productModal/ProductModal';
import RewardCardCouponModal from 'pages/rewardCard/sub_rewardCard/couponModal/CouponModal';
import { Button } from 'react-bootstrap';

import ExceptionHandleService from 'utils/exceptionHandler';
const _EHS = new ExceptionHandleService({
  _NAME: 'features/grouping/groupingOrganisms/SubTypeSelector.js',
  _NOTICE: ''
});

/**
 *
 * @param name - Form 表單名稱
 * @param modalType - 渲染彈窗的種類: point | store | coupon | product
 * @param couponType - 0: 全部 |  1:優惠券 | 2: 商品券
 * @returns
 */

function ModalType({ name, modalType = '', couponType = 0 }) {
  const [openPoint, setOpenPoint] = useState(false);
  const [openStore, setOpenStore] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [excludePointRewardIds, setExcludePointRewardIds] = useState([]);
  const [excludeCouponIds, setExcludeCouponIds] = useState([]);
  const [excludeProductIds, setExcludeProductIds] = useState([]);
  const { setValue, getValues, watch } = useFormContext();
  const [brandOptions, setBrandOptions] = useState([]); // 品牌下拉式
  const [cityCodeOptions, setCityCodeOptions] = useState([]);
  const [zipCodeOptions, setZipCodeOptions] = useState([]);
  const [channelOptions, setChannelOptions] = useState([]);
  const { disabled } = useGroupingContext();
  //   const [codeMap, setCodeMap] = useState({});

  const watchIds = watch(`${name}.ids`);
  const watchInfos = watch(`${name}.infos`);

  useEffect(() => {
    if (modalType !== 'store') return;
    try {
      const getInitOptions = async () => {
        const [optionBrand, zipCodeData] = await Promise.all([
          api.brand.getBrandMenu(),
          api.common.getTownshipCityData()
        ]);
        const formateBOptions = optionBrand?.map((o) => ({
          value: o?.brandId,
          label: o?.brandName,
          isOnly: o?.isCorporation
        }));
        if (zipCodeData) {
          const formatCityCode = zipCodeData.map((code) => {
            return {
              value: code.cityCode,
              label: code.cityName
            };
          });

          const formatZipCode = zipCodeData.reduce((acc, cur) => {
            let zips = cur.zips.map((code) => {
              return {
                value: code.zipCode,
                label: code.zipName
              };
            });
            return {
              ...acc,
              [cur.cityCode]: [{ value: 'all', label: '全部' }, ...zips]
            };
          }, {});
          setCityCodeOptions([
            { value: 'all', label: '全部' },
            ...formatCityCode
          ]);
          setZipCodeOptions({
            all: [{ value: 'all', label: '全部' }],
            ...formatZipCode
          });
        }
        setBrandOptions(formateBOptions);
      };
      getInitOptions();
    } catch (error) {
      _EHS.errorReport(error, 'init', _EHS._LEVEL.ERROR);
    }
  }, [modalType]);

  useEffect(() => {
    if (modalType !== 'rewardCard' || modalType === 'receivedRewardCard')
      return;
    try {
      const getBrandOptions = async () => {
        const resData = await api.brand.getBrandMenu();
        const formateBOptions = resData?.map((o) => ({
          value: o?.brandId,
          label: o?.brandName,
          isOnly: o?.isCorporation
        }));

        setBrandOptions(formateBOptions);
      };
      getBrandOptions();
    } catch (error) {
      _EHS.errorReport(error, 'init', _EHS._LEVEL.ERROR);
    }
  }, [modalType]);

  useEffect(() => {
    if (modalType !== 'product') return;
    try {
      const getInitOptions = async () => {
        const [optionBrand, optionChannel] = await Promise.all([
          api.brand.getBrandMenu(),
          api.channel.getChannelMenu()
        ]);
        const formateBOptions = optionBrand?.map((o) => ({
          value: o?.brandId,
          label: o?.brandName,
          isOnly: o?.isCorporation
        }));
        const formateCOptions = optionChannel?.list?.map((o) => ({
          value: o?.id,
          label: o?.name
        }));
        setBrandOptions(formateBOptions);
        setChannelOptions(formateCOptions);
      };
      getInitOptions();
    } catch (error) {
      _EHS.errorReport(error, 'init', _EHS._LEVEL.ERROR);
    }
  }, [modalType]);

  const handleOpenModal = (type) => {
    switch (type) {
      case _type.point:
        setOpenPoint(true);
        const _excludePointRewardIds = getValues(`${name}.ids`);
        setExcludePointRewardIds(_excludePointRewardIds);
        break;
      case _type.store:
        setOpenStore(true);
        break;
      case _type.coupon:
      case _type.rewardCard:
        setOpenCoupon(true);
        const _excludeIds_coupon = getValues(`${name}.ids`);
        const _excludeCouponIds = !!_excludeIds_coupon
          ? _excludeIds_coupon?.map((id) => ({ id }))
          : [];
        setExcludeCouponIds(_excludeCouponIds);
        break;
      case _type.product:
        setOpenProduct(true);
        const _excludeIds_product = getValues(`${name}.ids`);

        const _excludeProductIds = !!_excludeIds_product
          ? _excludeIds_product?.map((id) => ({ productId: id }))
          : [];
        setExcludeProductIds(_excludeProductIds);
        break;
      default:
        return null;
    }
  };

  const handleAddPoint = (values) => {
    const _originValues = getValues(name);
    const prevIds = _originValues?.ids ?? [];
    const prevNames = _originValues?.names ?? [];
    const newIds = !!values?.length ? values.map((item) => item?.id) : [];
    const newNames = !!values?.length ? values.map((item) => item?.name) : [];
    const _id = [...prevIds, ...newIds];
    const _names = [...prevNames, ...newNames];

    setValue(`${name}.ids`, _id);
    setValue(`${name}.names`, _names);
  };

  const handleAddStore = (val) => {
    const _originData = getValues(`${name}.infos`) ?? [];
    setValue(`${name}.infos`, [..._originData, ...val]);
  };

  const handleAddCoupon = (values) => {
    const _originValues = getValues(name);
    const prevIds = _originValues?.ids ?? [];
    const prevNames = _originValues?.names ?? [];
    const newIds = !!values?.length ? values.map((item) => item?.id) : [];
    const newNames = !!values?.length ? values.map((item) => item?.label) : [];
    const _id = [...prevIds, ...newIds];
    const _names = [...prevNames, ...newNames];

    setValue(`${name}.ids`, _id);
    setValue(`${name}.names`, _names);
  };

  const handleAddRewardCard = (values) => {
    const _originValues = getValues(name);
    const prevIds = _originValues?.ids ?? [];
    const prevNames = _originValues?.names ?? [];
    const newIds = !!values?.length ? values.map((item) => item?.id) : [];
    const newNames = !!values?.length
      ? values.map((item) => item?.couponName)
      : [];
    const _id = [...prevIds, ...newIds];
    const _names = [...prevNames, ...newNames];

    setValue(`${name}.ids`, _id);
    setValue(`${name}.names`, _names);
  };

  const handleAddProducts = (values) => {
    const _originValues = getValues(name);
    const prevIds = _originValues?.ids ?? [];
    const prevNames = _originValues?.names ?? [];
    const newIds = !!values?.length
      ? values.map((item) => item?.productId)
      : [];
    const newNames = !!values?.length
      ? values.map((item) => item?.productName)
      : [];
    const _id = [...prevIds, ...newIds];
    const _names = [...prevNames, ...newNames];

    setValue(`${name}.ids`, _id);
    setValue(`${name}.names`, _names);
  };

  let renderModal = null;
  switch (modalType) {
    case _type.point:
      renderModal = (
        <PointModal
          show={openPoint}
          setShow={setOpenPoint}
          onAdd={handleAddPoint}
          excludePointRewardIds={excludePointRewardIds}
          setExcludePointRewardIds={setExcludePointRewardIds}
        />
      );
      break;
    case _type.store:
      renderModal = (
        <StoreModal
          show={openStore}
          setShow={setOpenStore}
          onAdd={handleAddStore}
          brandOptions={brandOptions}
          cityCodeOptions={cityCodeOptions}
          zipCodeOptions={zipCodeOptions}
          //   codeMap={codeMap}
          selectedStore={getValues(`${name}.infos`)}
        />
      );
      break;
    case _type.coupon:
      renderModal = (
        <CouponModal
          show={openCoupon}
          setShow={setOpenCoupon}
          onAdd={handleAddCoupon}
          couponType={couponType}
          excludeCouponIds={excludeCouponIds}
          title='選擇兌換券'
        />
      );
      break;
    case _type.rewardCard:
      renderModal = (
        <RewardCardCouponModal
          show={openCoupon}
          setShow={setOpenCoupon}
          onAdd={handleAddRewardCard}
          couponType={couponType}
          excludeCouponIds={excludeCouponIds}
          brandOptions={brandOptions}
          title='集點卡設定'
        />
      );
      break;
    case _type.product:
      renderModal = (
        <ProductModal
          show={openProduct}
          setShow={setOpenProduct}
          onAdd={handleAddProducts}
          selectedProduct={excludeProductIds}
          brandOptions={brandOptions}
          channelOptions={channelOptions}
          title='商品設定'
        />
      );
      break;
    default:
      renderModal = null;
  }
  return (
    <>
      <TextField
        name={`${name}.conditional`}
        variant='select'
        fieldWidth='160px'
        disabled={disabled}
        formRules={{ required: { value: true, message: ' ' } }}
        data-recounting
        options={[
          { value: 'AND', label: '選項為AND' },
          { value: 'OR', label: '選項為OR' }
        ]}
      />
      <Button
        variant='outline-info'
        type='button'
        size='sm'
        className='rounded-pill'
        data-recounting
        onClick={() => handleOpenModal(modalType)}
        disabled={watchIds?.length >= 5 || watchInfos?.length >= 5}
        hidden={disabled}
      >
        ＋ 新增
      </Button>
      {(openPoint || openStore || openCoupon || openProduct || !disabled) &&
        renderModal}
    </>
  );
}

export default ModalType;
