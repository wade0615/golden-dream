import { useEffect } from 'react';
import { useWatch, useFormContext, useFieldArray } from 'react-hook-form';
import classNames from 'classnames';

import cityZipCodeStr from 'constants/cityZip';
import { subType } from '../groupingConfig';
import { useGroupingContext } from '../groupingHooks/grouping-hook';

import TextField from 'features/textField/TextField';
import { TagChip } from 'components/chip';
import { FormError } from 'components/form';
import Table, { Actions } from 'components/table/Table';
import { CloseIcon } from 'assets/icons';

function SubItem({ name }) {
  const { control, getValues, setValue, clearErrors, getFieldState } =
    useFormContext();
  const watchType = useWatch({ name: `${name}.type` });
  const watchIds = useWatch({ name: `${name}.data.ids` });
  const watchNames = useWatch({ name: `${name}.data.names` });
  const watchCityZip = useWatch({ name: `${name}.data.cityZip` });
  const watchInfos = useWatch({ name: `${name}.data.infos` });
  const { disabled } = useGroupingContext();

  const { fields: cityZipFields, remove: cityZipRemove } = useFieldArray({
    control,
    name: `${name}.data.cityZip`
  });

  const { fields: storeFields, remove: storeRemove } = useFieldArray({
    control,
    name: `${name}.data.infos`
  });

  /* for 表單畫面與資料連動 */
  useEffect(() => {
    if (!watchCityZip) setValue(`${name}.data.cityZip`, []);
  }, [watchCityZip, setValue, name]);

  /* for 表單畫面與資料連動 */
  useEffect(() => {
    if (!watchInfos) setValue(`${name}.data.infos`, []);
  }, [watchInfos, setValue, name]);

  const _isItems = [
    subType.address,
    subType.pointActivity,
    subType.bookingBrand,
    subType.bookingStore,
    subType.receivedDiscountCount,
    subType.writeOffDiscountCoupon,
    subType.commodityCoupon,
    subType.writeOffCommodityCoupon,
    subType.writeOffStore,
    subType.rewardCard,
    subType.receivedRewardCard,
    subType.orderBrand,
    subType.orderStore,
    subType.orderMealDate,
    subType.orderCommodity,
    subType.delivery,
    subType.payment
  ].find((item) => item === watchType);

  useEffect(() => {
    if (!!watchIds?.length) {
      clearErrors(`${name}.data.ids`);
    }
    if (!!watchInfos?.length) {
      clearErrors(`${name}.data.infos`);
    }
  }, [watchIds, clearErrors, name, watchInfos]);

  const handleDeleteZip = (idx) => {
    cityZipRemove(idx);
  };

  const handleDelete = (idx) => {
    const _ids = getValues(`${name}.data.ids`);
    const _names = getValues(`${name}.data.names`);
    _ids.splice(idx, 1);
    _names.splice(idx, 1);
    setValue(`${name}.data.ids`, _ids);
    setValue(`${name}.data.names`, _names);
  };

  if (!_isItems) return null;
  return (
    <>
      {/* 地址資料樣式 */}
      {/* //TODO:至少選一個的防呆 */}
      {(watchType === subType.address || watchType === subType.delivery) && (
        <>
          <div
            className={classNames({
              border: !!cityZipFields?.length,
              'border-1': !!cityZipFields?.length,
              'zipCode-container': true
            })}
          >
            {cityZipFields?.map((item, i) => (
              <div key={`${i}-${item.zipCode}`}>
                <span>{cityZipCodeStr[item.cityCode]}</span>
                <span>{cityZipCodeStr[item.zipCode]}</span>
                <button
                  type='button'
                  onClick={() => handleDeleteZip(i)}
                  data-recounting
                  hidden={disabled}
                >
                  <CloseIcon size='16px' />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {/* chip 資料樣式 */}
      {(watchType === subType.pointActivity ||
        watchType === subType.bookingBrand ||
        watchType === subType.receivedDiscountCount ||
        watchType === subType.writeOffDiscountCoupon ||
        watchType === subType.commodityCoupon ||
        watchType === subType.writeOffCommodityCoupon ||
        watchType === subType.rewardCard ||
        watchType === subType.receivedRewardCard ||
        watchType === subType.orderBrand ||
        watchType === subType.orderMealDate ||
        watchType === subType.orderCommodity ||
        watchType === subType.delivery ||
        watchType === subType.payment) && (
        <>
          <TextField
            name={`${name}.data.ids`}
            formRules={{
              required: { value: true, message: '請選擇' }
            }}
            hidden
          />
          <FormError>
            {getFieldState(`${name}.data.ids`)?.error?.message}
          </FormError>
          <div className='chip-container data-chips'>
            {!!watchIds && !!watchNames && (
              <>
                {watchIds?.map((item, i) => (
                  <TagChip
                    key={`${i}-${item}`}
                    label={watchNames[i]}
                    id={i}
                    onDelete={handleDelete}
                    rounded
                    hidden={disabled}
                    data-recounting
                  />
                ))}
              </>
            )}
          </div>
        </>
      )}
      {/* table 資料樣式 */}
      {/* //TODO:至少選一個的防呆 */}
      {(watchType === subType.bookingStore ||
        watchType === subType.writeOffStore ||
        watchType === subType.orderStore) &&
        storeFields?.length !== 0 && (
          <>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Th>品牌</Table.Th>
                  <Table.Th>門市名稱</Table.Th>
                  <Table.Th>縣市</Table.Th>
                  <Table.Th>區域</Table.Th>
                  <Table.Th>商場</Table.Th>
                  <Table.Th>門市代碼</Table.Th>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {storeFields?.map((store, idx) => (
                  <Table.Row key={store.storeId}>
                    <Table.Td>{store.brandName}</Table.Td>
                    <Table.Td>{store.storeName}</Table.Td>
                    <Table.Td>{cityZipCodeStr[store.cityCode]}</Table.Td>
                    <Table.Td>{cityZipCodeStr[store.zipCode]}</Table.Td>
                    <Table.Td>{store.mallName}</Table.Td>
                    <Table.Td>
                      <>
                        <span>{store.storeId}</span>
                        {!disabled && (
                          <Actions isShown>
                            <Actions.Close
                              onClick={() => storeRemove(idx)}
                              data-recounting
                            />
                          </Actions>
                        )}
                      </>
                    </Table.Td>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
    </>
  );
}

export default SubItem;
