import { useEffect, useState } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { typeCategory } from '../groupingConfig';
import TextField from 'features/textField/TextField';

import api from 'services/api';

import { mainType } from 'features/grouping/groupingConfig';
import { useGroupingContext } from '../groupingHooks/grouping-hook';

import TypeMolecules from './typeMolecules/TypeMolecules';
//!! ！！注意！！ TypeMolecules 只能給 SubTypeSelector 使用

import ExceptionHandleService from 'utils/exceptionHandler';
const _EHS = new ExceptionHandleService({
  _NAME: 'features/grouping/groupingOrganisms/SubTypeSelector.js',
  _NOTICE: ''
});

/** 
 ** 原子 (Atoms) -> 分子 (Molecules) -> 有機物 (Organisms) -> 模板 (Templates) -> 頁面 (Pages)
命名參考-- 原子設計(Atomic Design):
https://medium.com/%E7%94%9F%E6%B4%BB%E5%AF%A6%E9%A9%97%E5%AE%A4/blog-3-365-%E5%BE%9E0%E5%88%B01%E4%BA%86%E8%A7%A3%E5%8E%9F%E5%AD%90%E8%A8%AD%E8%A8%88-atomic-design-a1efdb3564a9
\ */

function SubTypeSelector({ name }) {
  const { setValue, clearErrors, unregister } = useFormContext();
  const watchMainType = useWatch({ name: `${name}.mainType` }); // 監聽次選項
  const watchType = useWatch({ name: `${name}.type` });
  const [clusterCommonSetting, setClusterCommonSetting] = useState(null);
  const { disabled } = useGroupingContext();

  /* for 表單畫面與資料連動 */
  useEffect(() => {
    if (watchMainType) {
      setValue(`${name}.mainType`, watchMainType);
    }
  }, [watchMainType, setValue, name]);

  /* for 表單畫面與資料連動 */
  useEffect(() => {
    if (watchType) setValue(`${name}.type`, watchType);
  }, [watchType, setValue, name]);

  /* 移除使用者挑選過的type data */
  const handleCallBack = (val) => {
    setValue(`${name}.data`, {});
    unregister(`${name}.ids`);
    clearErrors(`${name}.data`);
  };

  /* 分群通用設定 */
  useEffect(() => {
    if (watchMainType !== mainType.activityLevel || !!clusterCommonSetting)
      return;

    const getMemberShipOptions = async () => {
      try {
        const clusterRes = await api.cluster.getClusterCommonSetting();
        if (!clusterRes) throw Error;
        setClusterCommonSetting(clusterRes);
      } catch (error) {
        _EHS.errorReport(error, 'getMemberShipOptions', _EHS._LEVEL.ERROR);
      }
    };
    getMemberShipOptions();
  }, [watchMainType, clusterCommonSetting]);

  return (
    <>
      {watchMainType && (
        <TextField
          name={`${name}.type`}
          variant='select'
          options={typeCategory[watchMainType]}
          fieldWidth='160px'
          callBackFn={handleCallBack}
          formRules={{ required: { value: true, message: ' ' } }}
          disabled={disabled}
          data-recounting
        />
      )}
      <TypeMolecules
        name={`${name}.data`}
        mainType={watchMainType}
        subType={watchType}
        data={{ ...clusterCommonSetting }}
      />
    </>
  );
}

export default SubTypeSelector;
