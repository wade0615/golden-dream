import { useEffect, useState } from 'react';
import {
  genderOptions,
  dateOptions,
  subType
} from 'features/grouping/groupingConfig';

import api from 'services/api';
import { groupingModalType as modalTypeMap } from '../../groupingConstants/groupingModalType';

/* type 模組 */
import ConditionalType from './ConditionalType';
import ConditionalDateType from './ConditionalDateType';
import CheckboxType from './CheckboxType';
import AddressType from './AddressType';
import ModalType from './ModalType';
import ChipSelectType from './ChipSelectType';
import NdayType from './NdayType';
import NumberOfPeopleType from './NumberOfPeopleType';

import ExceptionHandleService from 'utils/exceptionHandler';
const _EHS = new ExceptionHandleService({
  _NAME: 'features/grouping/groupingOrganisms/typeMolecules',
  _NOTICE: ''
});

//!! ！！注意！！ TypeMolecules 只能給 TypeSelector 使用
/** 
 ** 原子 (Atoms) -> 分子 (Molecules) -> 有機物 (Organisms) -> 模板 (Templates) -> 頁面 (Pages)
命名參考-- 原子設計(Atomic Design):
https://medium.com/%E7%94%9F%E6%B4%BB%E5%AF%A6%E9%A9%97%E5%AE%A4/blog-3-365-%E5%BE%9E0%E5%88%B01%E4%BA%86%E8%A7%A3%E5%8E%9F%E5%AD%90%E8%A8%AD%E8%A8%88-atomic-design-a1efdb3564a9
\ */

function TypeMolecules({ name, subType: type, mainType, data }) {
  const [addrOptions, setAddrOptions] = useState([]);
  const [channelOptions, setChannelOptions] = useState([]);
  const [specialMemberOptions, setSpecialMemberOptions] = useState([]);
  const [memberShipOptions, setMemberShipOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [orderMealOptions, setOrderMealOptions] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  let moduleComponent = null;

  /*zipCode */
  useEffect(() => {
    if (
      (type !== 'address' && type !== 'delivery') ||
      addrOptions?.length !== 0
    )
      return;

    const getAddrOptions = async () => {
      try {
        const addrRes = await api.common.getTownshipCityData();
        if (!addrRes) throw Error;

        const _data = addrRes?.map(({ cityCode, cityName, zips }) => ({
          value: cityCode,
          label: cityName,
          children: !(zips && zips?.length)
            ? []
            : zips.map(({ zipCode, zipName }) => ({
                value: zipCode,
                label: zipName
              }))
        }));
        setAddrOptions(_data);
      } catch (error) {
        _EHS.errorReport(error, 'getAddrOptions', _EHS._LEVEL.ERROR);
      }
    };
    getAddrOptions();
  }, [type, addrOptions]);

  /* 渠道 */
  useEffect(() => {
    if (
      (type !== subType.registrationChannel && //註冊渠道
        type !== subType.openChannel && //開通渠道
        type !== subType.unOpenChannel &&
        type !== subType.signInChannel &&
        type !== subType.orderChannel) || //未開通渠道
      channelOptions.length !== 0
    )
      return;
    const getChannelOptions = async () => {
      try {
        const channelRes = await api.channel.getChannelMenu();
        if (!channelRes) throw Error;
        const _data = channelRes?.list?.map(({ id, name }) => ({
          value: id,
          label: name
        }));
        setChannelOptions(_data);
      } catch (error) {
        _EHS.errorReport(error, 'getChannelOptions', _EHS._LEVEL.ERROR);
      }
    };
    getChannelOptions();
  }, [type, channelOptions]);

  /* 特殊會員 */
  useEffect(() => {
    if (type !== subType.specialMemberType || specialMemberOptions.length !== 0)
      return;

    const getSpecialMemberOptions = async () => {
      try {
        const memberRes = await api.member.getMemberSpecialTypeMenu();
        if (!memberRes) throw Error;
        const _data = memberRes?.list?.map(({ seq, name }) => ({
          value: seq,
          label: name
        }));
        setSpecialMemberOptions(_data);
      } catch (error) {
        _EHS.errorReport(error, 'getSpecialMemberOptions', _EHS._LEVEL.ERROR);
      }
    };
    getSpecialMemberOptions();
  }, [type, specialMemberOptions]);

  /* 會籍 */
  useEffect(() => {
    if (type !== subType.memberShip || specialMemberOptions.length !== 0)
      return;

    const getMemberShipOptions = async () => {
      try {
        const memberShiRes = await api.memberShip.getMemberShipMenu();
        if (!memberShiRes) throw Error;
        setMemberShipOptions(memberShiRes?.memberShipList);
      } catch (error) {
        _EHS.errorReport(error, 'getMemberShipOptions', _EHS._LEVEL.ERROR);
      }
    };
    getMemberShipOptions();
  }, [type, specialMemberOptions]);

  /* 品牌 */
  useEffect(() => {
    if (
      (type !== subType.bookingBrand && type !== subType.orderBrand) ||
      brandOptions.length !== 0
    )
      return;
    const getBrandOptions = async () => {
      try {
        const res = await api.brand.getBrandMenu();
        if (!res) throw Error;
        const formateRes = res?.map((ele) => ({
          label: ele?.brandName ?? '',
          value: ele?.brandId ?? '',
          hidden: false
        }));
        setBrandOptions(formateRes);
      } catch (error) {
        _EHS.errorReport(error, 'getBrandOptions', _EHS._LEVEL.ERROR);
      }
    };
    getBrandOptions();
  }, [type, brandOptions]);

  /* 餐期 */
  useEffect(() => {
    if (type !== 'orderMealDate' || orderMealOptions?.length !== 0) return;

    const getMealOptions = async () => {
      try {
        const res = await api.mealPeriod.getMealPeriodList();
        if (!res) throw Error;
        const _data = res?.map(({ mealPeriodId, mealPeriodName }) => ({
          value: mealPeriodId,
          label: mealPeriodName
        }));
        setOrderMealOptions(_data);
      } catch (error) {
        _EHS.errorReport(error, 'getMealOptions', _EHS._LEVEL.ERROR);
      }
    };
    getMealOptions();
  }, [type, orderMealOptions]);

  /* 支付方式 */
  useEffect(() => {
    if (type !== 'payment' || paymentOptions?.length !== 0) return;

    const getPaymentOptions = async () => {
      try {
        const res = await api.payment.getpaymentList();
        if (!res) throw Error;
        const _data = res?.map(({ paymentId, paymentName }) => ({
          value: paymentId,
          label: paymentName
        }));
        setPaymentOptions(_data);
      } catch (error) {
        _EHS.errorReport(error, 'getPaymentOptions', _EHS._LEVEL.ERROR);
      }
    };
    getPaymentOptions();
  }, [type, paymentOptions]);

  switch (type) {
    /* ----- 基本資料 ----- */
    case subType.age:
      moduleComponent = <ConditionalType name={name} suffixText='歲' />;
      break;
    case subType.gender:
      moduleComponent = <CheckboxType name={name} options={genderOptions} />;
      break;
    case subType.birthdayMonth:
      moduleComponent = <CheckboxType name={name} options={dateOptions} />;
      break;
    case subType.address:
      moduleComponent = <AddressType name={name} options={addrOptions} />;
      break;
    case subType.registrationChannel:
      moduleComponent = <CheckboxType name={name} options={channelOptions} />;
      break;
    case subType.registrationDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    case subType.openChannel:
      moduleComponent = <CheckboxType name={name} options={channelOptions} />;
      break;
    case subType.unOpenChannel:
      moduleComponent = <CheckboxType name={name} options={channelOptions} />;
      break;
    case subType.specialMemberType:
      moduleComponent = (
        <CheckboxType name={name} options={specialMemberOptions} />
      );
      break;
    /*----- B1 會籍 -----*/
    case subType.memberShip:
      moduleComponent = (
        <CheckboxType name={name} options={memberShipOptions} />
      );
      break;
    case subType.memberShipUpgradeDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    case subType.memberShipExpiredDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    case subType.upgradeDiffAmount:
      moduleComponent = <ConditionalType name={name} suffixText='元' />;
      break;
    case subType.upgradeDiffCount:
      moduleComponent = <ConditionalType name={name} suffixText='次' />;
      break;
    /*---- B2 積點----- */
    case subType.pointActivity:
      moduleComponent = (
        <ModalType name={name} modalType={modalTypeMap.point} />
      );
      break;
    case subType.lastPoint:
      moduleComponent = <ConditionalType name={name} suffixText='點' />;
      break;
    case subType.pointExpiredDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    case subType.usedPoint:
      moduleComponent = <ConditionalType name={name} suffixText='點' />;
      break;
    case subType.usedPointDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    /*---- B3 活躍度----- */
    case subType.mainMember:
      moduleComponent = (
        <NdayType
          isConsumption='yes'
          numOne={data?.mainMemberConsumerDay ?? 0}
        />
      );
      break;
    case subType.drowsyMember:
      moduleComponent = (
        <NdayType
          isConsumption='no'
          numOne={data?.drowsyMemberNotConsumerDay ?? 0}
          numTwo={data?.drowsyMemberConsumerDay ?? 0}
        />
      );
      break;
    case subType.sleepyMember:
      moduleComponent = (
        <NdayType
          isConsumption='no'
          numOne={data?.sleepyMemberNotConsumerDay ?? 0}
          numTwo={data?.sleepyMemberConsumerDay ?? 0}
        />
      );
      break;
    case subType.lostMember:
      moduleComponent = (
        <NdayType
          isConsumption='yes'
          numOne={data?.lostMemberNotConsumerDay ?? 0}
        />
      );
      break;
    /*---- B4 會員互動 ----- */
    case subType.memberSignIn:
      moduleComponent = <ConditionalType name={name} suffixText='天' />;
      break;
    case subType.signInChannel:
      moduleComponent = <CheckboxType name={name} options={channelOptions} />;
      break;
    case subType.referrerPeople:
      moduleComponent = <ConditionalType name={name} suffixText='人' />;
      break;
    case subType.pointUse:
    case subType.discountWriteOff:
    case subType.commodityWriteOff:
    case subType.rewardCardRedeem:
      moduleComponent = <ConditionalType name={name} suffixText='次' />;
      break;
    /*---- B5 標籤 ----- */
    case subType.memberTag:
      moduleComponent = <p>TODO</p>; //TODO
      break;
    case subType.useTagDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    /*---- B6 訂位 ----- */
    case subType.bookingBrand:
      moduleComponent = (
        <ChipSelectType
          name={name}
          options={brandOptions}
          setOptions={setBrandOptions}
        />
      );
      break;
    case subType.bookingStore:
      moduleComponent = (
        <ModalType
          name={name}
          modalType={modalTypeMap.store}
          options={brandOptions}
        />
      );
      break;
    case subType.bookingPeople:
      moduleComponent = <NumberOfPeopleType name={name} />;
      break;
    case subType.bookingCount:
      moduleComponent = <ConditionalType name={name} suffixText='次' />;
      break;
    case subType.notCheckInCount:
      moduleComponent = <ConditionalType name={name} suffixText='次' />;
      break;
    case subType.mealDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    /*---- B7 優惠券 ----- */
    case subType.receivedDiscountCount:
      moduleComponent = (
        <ModalType
          name={name}
          modalType={modalTypeMap.coupon}
          options={brandOptions}
          couponType={1}
        />
      );
      break;
    case subType.validDiscountCount:
      moduleComponent = <ConditionalType name={name} suffixText='張' />;
      break;
    case subType.discountExpirationDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    case subType.writeOffDiscountCoupon:
      moduleComponent = (
        <ModalType
          name={name}
          modalType={modalTypeMap.coupon}
          options={brandOptions}
          couponType={1}
        />
      );
      break;
    case subType.writeOffDiscountCouponCount:
      moduleComponent = <ConditionalType name={name} suffixText='張' />;
      break;
    case subType.writeOffDiscountCouponDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    /*---- B8 商品券 ----- */
    case subType.commodityCoupon:
      moduleComponent = (
        <ModalType name={name} modalType={modalTypeMap.coupon} couponType={2} />
      );
      break;
    case subType.commodityCouponExpiredDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    case subType.writeOffCommodityCoupon:
      moduleComponent = (
        <ModalType name={name} modalType={modalTypeMap.coupon} couponType={2} />
      );
      break;
    case subType.writeOffStore:
      moduleComponent = (
        <ModalType
          name={name}
          modalType={modalTypeMap.store}
          options={brandOptions}
        />
      );
      break;
    case subType.writeOffCommodityCouponDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    case subType.notWriteOffCommodityCoupon:
      moduleComponent = (
        <ModalType name={name} modalType={modalTypeMap.coupon} couponType={2} />
      );
      break;
    /*---- B9 集點卡 ----- */
    case subType.rewardCard:
      moduleComponent = (
        <ModalType name={name} modalType={modalTypeMap.rewardCard} />
      );
      break;
    case subType.rewardCardDiffPoint:
      moduleComponent = <ConditionalType name={name} suffixText='點' />;
      break;
    case subType.receivedRewardCard:
      moduleComponent = (
        <ModalType name={name} modalType={modalTypeMap.rewardCard} />
      );
      break;
    case subType.receivedRewardCardPoint:
      moduleComponent = <ConditionalType name={name} suffixText='點' />;
      break;
    case subType.redeemedRewardCardDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    /*---- C1 消費行為 ----- */
    case subType.orderChannel:
      moduleComponent = <CheckboxType name={name} options={channelOptions} />;
      break;
    case subType.orderBrand:
      moduleComponent = (
        <ChipSelectType
          name={name}
          options={brandOptions}
          setOptions={setBrandOptions}
        />
      );
      break;
    case subType.orderStore:
      moduleComponent = (
        <ModalType name={name} modalType={modalTypeMap.store} />
      );
      break;
    case subType.orderDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    case subType.orderPeople:
      moduleComponent = (
        <ConditionalType name={name} suffixText='位' isContainChild />
      );
      break;
    case subType.orderMealDate:
      moduleComponent = (
        <ChipSelectType
          name={name}
          options={orderMealOptions}
          setOptions={setOrderMealOptions}
        />
      );
      break;
    case subType.orderCommodity:
      moduleComponent = (
        <ModalType name={name} modalType={modalTypeMap.product} />
      );
      break;
    case subType.orderCount:
      moduleComponent = <ConditionalType name={name} suffixText='次' />;
      break;
    case subType.orderOriginalAmount:
    case subType.orderPaidAmount:
      moduleComponent = <ConditionalType name={name} suffixText='元' />;
      break;
    case subType.discountCount:
      moduleComponent = <ConditionalType name={name} suffixText='次' />;
      break;
    case subType.discountAmount:
      moduleComponent = <ConditionalType name={name} suffixText='元' />;
      break;
    case subType.discountPointCount:
      moduleComponent = <ConditionalType name={name} suffixText='次' />;
      break;
    case subType.discountPoint:
      moduleComponent = <ConditionalType name={name} suffixText='點' />;
      break;
    case subType.cancelReturnDate:
      moduleComponent = <ConditionalDateType name={name} />;
      break;
    case subType.cancelReturnCount:
      moduleComponent = <ConditionalType name={name} suffixText='次' />;
      break;
    case subType.cancelReturnAmount:
      moduleComponent = <ConditionalType name={name} suffixText='元' />;
      break;
    case subType.delivery:
      moduleComponent = <AddressType name={name} options={addrOptions} />;
      break;
    case subType.payment:
      moduleComponent = (
        <ChipSelectType
          name={name}
          options={paymentOptions}
          setOptions={setPaymentOptions}
        />
      );
      break;
    default:
      moduleComponent = null;
  }
  return <>{moduleComponent}</>;
}

export default TypeMolecules;
