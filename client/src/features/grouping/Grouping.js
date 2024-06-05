import { createContext } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { useMaxCountsContext } from './groupingHooks/max-counts-hook';
import { GroupingProvider } from './groupingHooks/grouping-hook';

import { Stack } from 'react-bootstrap';
import { GroupingAccordion, GroupingBtn } from './groupingAtoms';
import { MainTypeSelector } from './groupingOrganisms';

import './GroupingStyle.scss';

/** 
 ** 命名參考: 原子 (Atoms) -> 分子 (Molecules) -> 有機物 (Organisms) -> 模板 (Templates) -> 頁面 (Pages)
 ref: 原子設計(Atomic Design)
https://medium.com/%E7%94%9F%E6%B4%BB%E5%AF%A6%E9%A9%97%E5%AE%A4/blog-3-365-%E5%BE%9E0%E5%88%B01%E4%BA%86%E8%A7%A3%E5%8E%9F%E5%AD%90%E8%A8%AD%E8%A8%88-atomic-design-a1efdb3564a9
\ */

/** 
 ******** 資料結構範例  ********
 NAME : [
// cluster 1
{
conditional: 'AND',
clusterType: 'basic',
setting: [
{
    conditional: 'AND',
    mainType: 'userData',
    type: 'gender',
    data: {}
},
{
    conditional: 'AND',
    mainType: 'userData',
    type: 'age'
    data: {}
},
],
},
// cluster 2
{
conditional: 'AND',
clusterType: 'memberActivities',
setting: [
{
    conditional: 'AND',
    mainType: 'booking',
    type: 'gender'
    data: {}
},
{
    conditional: 'AND',
    mainType: 'discountCoupon',
    type: ''
    data: {}
},
],
}
]
  ******** END ********  
*/

//全域state: 群發類型
export const GroupingContext = createContext();

/**
 * Description 主分類分群
 * @param {String} name='name' Form表單的 key
 * @param {Number} maxLimit=10 條件最多數數量
 * @param {String} actionType 群發類型 - single: 單次, regular: 定期
 * @param {Boolean} disabled 是否禁用 | 預設: false
 */
function Grouping({
  name = 'name',
  actionType = 'single',
  isDisabled = false
}) {
  const typeMapping = {
    basic: 'userData',
    consume: 'consumptionStatistics'
  };
  const { control, watch, setError } = useFormContext();
  const targetWatch = watch(name);
  const { addCounts, minusCounts, disabledAdd } = useMaxCountsContext();
  const methods = useFieldArray({ control, name, shouldUnregister: false });
  const { fields: targetFields, append, remove } = methods;

  const controlledFields = targetFields.map((field, index) => {
    return {
      ...field
      //   ...targetWatch[index]
    };
  });

  /* 新增設定 */
  const handleCreateGrouping = (val) => {
    setError('positiveData', '');
    addCounts();
    append({
      conditional: val[0],
      clusterType: val[1],
      setting: [
        {
          type: '',
          mainType: val[1] !== 'memberActivities' ? typeMapping[val[1]] : '', // 基本資料/消費行為次選項自動帶入次選項,會員活動不帶入
          data: {}
        }
      ]
    });
  };

  /* 刪除設定 */
  const handleDeleteGrouping = (idx) => {
    minusCounts(targetWatch[idx]?.setting?.length ?? 0);
    remove(idx);
  };

  return (
    <GroupingProvider>
      <div id='grouping-EA228A82-8A0D-405A-8EB4-BC00B902629A'>
        {controlledFields?.map((field, idx) => {
          return (
            <GroupingAccordion
              key={field.id}
              conditionType={[field.conditional, field.clusterType]}
              onDelete={() => handleDeleteGrouping(idx)}
            >
              <MainTypeSelector
                name={`${name}[${idx}].setting`}
                clusterType={field.clusterType}
                typeMapping={typeMapping}
                settingFields={field.setting}
                actionType={actionType}
                isDisabled={isDisabled}
              />
            </GroupingAccordion>
          );
        })}

        <Stack direction='horizontal' gap={2} className='ms-4'>
          <GroupingBtn
            callBackFn={handleCreateGrouping}
            disabled={disabledAdd} //超過上限時禁用
            hidden={isDisabled} //無法編輯時隱藏
          />
          <GroupingBtn
            conditional={'OR'}
            callBackFn={handleCreateGrouping}
            disabled={disabledAdd} //超過上限時禁用
            hidden={isDisabled} //無法編輯時隱藏
          />
        </Stack>
      </div>
    </GroupingProvider>
  );
}

export default Grouping;
