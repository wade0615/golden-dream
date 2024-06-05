import { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import { useGroupingContext } from '../../groupingHooks/grouping-hook';
import TextField from 'features/textField/TextField';
import { GroupingModal } from '../../groupingAtoms';
import { Button } from 'react-bootstrap';

function Address({ name, options = [] }) {
  const [show, setShow] = useState(false);
  const { setValue, getValues } = useFormContext();
  const { disabled } = useGroupingContext();
  const modalMethods = useForm({
    zipCheckbox: []
  });
  if (!options.length) return;

  /* accordionCheckbox 選擇後，給外層所需的格式 */
  const zipSwitcher = !!options.length
    ? options.reduce((acc, cur) => {
        const _zips = cur?.children?.reduce(
          (zipAcc, zipCur) => ({
            ...zipAcc,
            [zipCur.value]: {
              cityCode: cur.value,
              zipCode: zipCur.value
            }
          }),
          {}
        );
        return { ...acc, ..._zips };
      }, {})
    : [];

  /* 打開選擇 zipCode modal， 並加入已勾選資料   */
  const handleShowModal = () => {
    const _parentData = getValues(`${name}.cityZip`);
    const _defaultData = !!_parentData?.length
      ? _parentData.map((item) => item.zipCode)
      : [];
    modalMethods.reset({ zipCheckbox: _defaultData });
    setShow(true);
  };

  /* 關閉 modal 並刪除所勾選資料  */
  const handleCancel = () => {
    setShow(false);
    modalMethods.reset();
  };

  /* 關閉 modal 並資料專換為外部 form 表單所需格式  */
  const handleAdd = () => {
    const _data = modalMethods
      .getValues()
      ?.zipCheckbox?.map((code) => zipSwitcher[code]);
    setValue(`${name}.cityZip`, _data);
    setShow(false);
    modalMethods.reset();
  };

  return (
    <FormProvider {...modalMethods}>
      <Button
        type='button'
        size='sm'
        onClick={handleShowModal}
        variant='outline-info'
        hidden={disabled}
        className='rounded-pill'
        data-recounting
      >
        + 新增
      </Button>
      {show && (
        <GroupingModal
          show={show}
          title='選擇居住地'
          handleCancel={handleCancel}
          handleAdd={handleAdd}
        >
          <TextField
            name='zipCheckbox'
            variant='accordionCheckbox'
            options={options}
            disabled={disabled}
            data-recounting
          />
        </GroupingModal>
      )}
    </FormProvider>
  );
}

export default Address;
