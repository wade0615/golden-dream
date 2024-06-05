import { Fragment } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { mainTypeCategory } from '../groupingConfig';

import { useMaxCountsContext } from '../groupingHooks/max-counts-hook';
import { useGroupingContext } from '../groupingHooks/grouping-hook';
import SubTypeSelector from './SubTypeSelector';
import SubItem from './SubItem';
import { Stack } from 'react-bootstrap';
import TextField from 'features/textField/TextField';
import { AddButton, ToggleButton } from '../groupingAtoms';
import { CloseIcon } from 'assets/icons';
import { useEffect, useMemo } from 'react';

/**
 * Description 次分類選擇器
 * @param {String} name - Form 表單裡的 key
 * @param {String} clusterType - 下拉式選單的類型
 * @param {String} typeMapping - 輔助基本資料/消費行為下拉式自動帶入 type
 * @param {Boolean} disabled - 是否禁用 | 預設: false
 */
function MainTypeSelector({
  name,
  clusterType,
  typeMapping,
  actionType,
  isDisabled
}) {
  const { addCounts, minusCounts, disabledAdd, disabledMinus } =
    useMaxCountsContext();
  const { control, watch, setValue, clearErrors, unregister } =
    useFormContext();
  const { setDisabled, setActionType } = useGroupingContext();

  // 設定 default disabled, actionType
  useEffect(() => {
    setDisabled(isDisabled);
    setActionType(actionType);
    // eslint-disable-next-line
  }, [isDisabled, actionType]);

  const _showMainType = (cType) => cType === 'memberActivities'; // 只有會員活動顯示次選項，其他自動帶入
  const {
    fields: settingFields,
    append,
    update,
    remove
  } = useFieldArray({
    control,
    name,
    shouldUnregister: false
  });
  const watchSettingFields = watch(name);
  const watchMemoSettingFields = useMemo(
    () => watchSettingFields,
    [watchSettingFields]
  );

  const controlledSettingFields = settingFields.map((f, i) => {
    return {
      ...f,
      ...watchSettingFields[i]
    };
  });

  /* 移除使用者選擇不同的mainType 後資料 */
  const handleCallBack = (name) => {
    unregister(`${name}.data`); // 清除勾選
    setValue(`${name}.type`, ''); // 清除表單資料
    clearErrors(`${name}.type`); // 清除錯誤
  };

  const handleCreateType = (val) => {
    addCounts();
    append(val);
  };

  const handleDelete = (idx) => {
    minusCounts();
    remove(idx);
  };

  /* 移除setting第一個陣列的的 and/or 選項 */
  useEffect(() => {
    if (!watchMemoSettingFields?.length) return;
    const _firstSettingData = { ...watchMemoSettingFields[0] };
    if (!_firstSettingData?.conditional) return;
    delete _firstSettingData?.conditional;
    update(0, _firstSettingData);
    // eslint-disable-next-line
  }, [watchMemoSettingFields]);

  return (
    <>
      {controlledSettingFields?.map((field, idx) => {
        return (
          <Fragment key={field.id}>
            <Stack
              direction='horizontal'
              gap={2}
              className='mb-2'
              style={{ flexWrap: 'wrap' }}
            >
              {idx !== 0 && (
                <ToggleButton
                  name={`${name}[${idx}].conditional`}
                  disabled={isDisabled}
                  data-recounting
                />
              )}
              {_showMainType(clusterType) && (
                <TextField
                  name={`${name}[${idx}].mainType`}
                  variant='select'
                  options={mainTypeCategory[clusterType]}
                  callBackFn={() => handleCallBack(`${name}[${idx}]`)}
                  fieldWidth='8rem'
                  style={{ minWidth: '8rem' }}
                  formRules={{ required: { value: true, message: ' ' } }}
                  disabled={isDisabled}
                  data-recounting
                />
              )}
              <SubTypeSelector name={`${name}[${idx}]`} />
              <button
                type='button'
                onClick={() => handleDelete(idx)}
                disabled={disabledMinus}
                hidden={isDisabled}
                data-recounting
              >
                <CloseIcon size='20px' color='#5e6366' data-recounting />
              </button>
            </Stack>
            <SubItem name={`${name}[${idx}]`} />
          </Fragment>
        );
      })}
      <AddButton
        data-recounting
        onClick={() =>
          handleCreateType({
            conditional: 'AND',
            mainType: !_showMainType(clusterType)
              ? typeMapping[clusterType]
              : '', // 基本資料/消費行為次選項自動帶入次選項,會員活動不帶入
            type: '',
            data: {}
          })
        }
        disabled={disabledAdd}
        hidden={isDisabled}
      />
    </>
  );
}

export default MainTypeSelector;
