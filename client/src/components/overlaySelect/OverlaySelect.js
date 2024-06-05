import { forwardRef, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useController, FormProvider, useForm } from 'react-hook-form';
import Popover from 'react-bootstrap/Popover';
import TextField from 'features/textField/TextField';
import { Form } from 'react-bootstrap';

const popover = (content) => (
  <Popover id='tooltip-example' style={{ maxWidth: '23%' }}>
    <Popover.Body>{content}</Popover.Body>
  </Popover>
);

const OverlaySelect = forwardRef(
  ({ children, filterDateOptions, onSelectValue }, ref) => {
    const _defaultSearch = {
      filterDate: '90'
    };
    const [show, setShow] = useState(false);

    const methods = useForm({
      defaultValues: _defaultSearch
    });

    const filterDateMethod = useController({
      name: 'filterDate',
      control: methods?.control
    });

    /** 日期更改事件 */
    const handleFilterDateChange = async () => {
      const data = methods?.getValues();
      onSelectValue(data?.filterDate);
      if (data?.filterDate === 'cust') {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    const handleToggle = () => {
      setShow((prev) => !prev);
    };

    const onError = (error) => {
      console.log(error);
    };

    const onSubmit = (submit) => {
      console.log(submit);
    };

    return (
      <FormProvider {...methods}>
        <Form noValidate onSubmit={methods?.handleSubmit(onSubmit, onError)}>
          <OverlayTrigger
            placement='bottom'
            overlay={popover(children)}
            show={show}
          >
            <div>
              <TextField
                variant='select'
                name='filterDate'
                id='filterDate'
                isPlaceholder={false}
                options={filterDateOptions}
                value={filterDateMethod?.field?.value}
                callBackFn={handleFilterDateChange}
                style={{ zIndex: show ? 11 : 9 }}
              />
            </div>
          </OverlayTrigger>
          {show && (
            <div
              onClick={handleToggle}
              className=' position-fixed top-0 start-0 w-100 h-100'
              style={{ zIndex: 10 }}
            />
          )}
        </Form>
      </FormProvider>
    );
  }
);

export default OverlaySelect;
