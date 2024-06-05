import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import Grouping from './Grouping';
import { MaxCountsProvider } from './groupingHooks/max-counts-hook';
import { groupingFrequencyType } from './groupingConstants/groupingFrequencyType';

import { Stack, Form } from 'react-bootstrap';

function Demo() {
  const groupingMethods = useForm({
    defaultValues: {
      target: []
    }
  });

  /*  初始資料共有多少筆資料 */
  let _defaultCounts = 0;
  groupingMethods.getValues()?.target?.forEach((item) => {
    let _currentCounts = item?.setting?.length ?? 0;
    _defaultCounts += _currentCounts;
  });

  const handleSubmit = (data) => {
    console.log(data);
  };
  return (
    <MaxCountsProvider maxCounts={5} defaultCounts={_defaultCounts}>
      {/****！！條件最大數量全域 state ， 必加至此條件的最外層！！****/}
      {/****！！必使用{(props) => (...)}！！****/}
      {(props) => (
        <FormProvider {...groupingMethods}>
          {/* Form 表單  */}
          <Form onSubmit={groupingMethods.handleSubmit(handleSubmit)}>
            <Stack direction='horizontal' style={{ alignItems: 'flex-start' }}>
              <div style={{ minWidth: '160px' }} className='m-3'>
                <p>分群條件</p>
                <p>
                  {props.currentCounts} / {props.maxCounts}
                </p>
              </div>
              <Grouping
                name='target'
                frequencyType={groupingFrequencyType.single} //單次分群：single or 定期分群:regular
              />
            </Stack>

            <button>送出</button>
          </Form>
        </FormProvider>
      )}
    </MaxCountsProvider>
  );
}

export default Demo;
