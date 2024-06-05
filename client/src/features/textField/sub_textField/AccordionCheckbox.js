import { memo, useContext, useState, useEffect, Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import { Accordion, AccordionContext } from 'react-bootstrap';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { useFormContext } from 'react-hook-form';

import IndeterminateCheckbox from 'components/indeterminateCheckbox/IndeterminateCheckbox';
import { ArrowVectorRight } from 'assets/icons';

// const optionExample = [
//   {
//     value: '',
//     label: '',
//     children: [
//       {
//         value: '',
//         label: ''
//       }
//     ]
//   },
//   {
//     value: '',
//     label: '',
//     children: [
//       {
//         value: '',
//         label: ''
//       }
//     ]
//   }
// ];

// const feildNameOutputExample = ['childValueId', 'childValueId', 'childValueId'];

/**
 * @param {Object Array} options 延展列表
 * @param {String} headerDefaultColor header 未展開預設背景顏色
 * @param {String} headerActiveColor header 展開背景顏色
 * @param {String} fieldWidth 寬度控制
 * @returns
 */
const AccordionCheckbox = ({
  options = [],
  headerDefaultColor = '#f5f5f5',
  headerActiveColor = '#f5f5f5',
  hookProps = {},
  isValid = false,
  fieldWidth = '',
  ...rest
}) => {
  const {
    field,
    fieldState: { error }
  } = hookProps;
  const methods = useFormContext();

  const isInvalid = !!error?.message && !isValid;
  const [checkedState, setCheckedState] = useState([]);

  /** 監聽 field value ，更新子勾選狀態 */
  useEffect(() => {
    const fieldValue = field.value;
    const checkState = options?.reduce((acc, cur) => {
      const childrenState = cur?.children?.reduce((_accChild, _curChild) => {
        return {
          ..._accChild,
          [_curChild?.value]: fieldValue?.find(
            (value) => value === _curChild.value
          )
            ? true
            : false
        };
      }, {});
      return {
        ...acc,
        ...childrenState
      };
    }, {});

    setCheckedState(checkState);
  }, [field, options]);

  /** Header 展開切換 */
  const ContextHeaderToggle = ({ children, eventKey, callback }) => {
    const { activeEventKey } = useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    );

    let isCurrentEventKey;
    // 檢查 activeEventKey 是否為陣列
    if (Array.isArray(activeEventKey)) {
      // 如果是陣列，使用 includes 方法來判斷
      isCurrentEventKey = activeEventKey.includes(eventKey);
    }

    const _totalOptions = options?.[eventKey]?.children;
    const checkWatch = methods.getValues(field.name)?.filter((_fieldValue) => {
      return _totalOptions
        ?.map((_totalOption) => _totalOption.value)
        ?.includes(_fieldValue);
    });

    const _totalOptionCounts = options?.[eventKey]?.children?.length;

    return (
      <div
        onClick={decoratedOnClick}
        style={{
          backgroundColor: isCurrentEventKey
            ? headerActiveColor
            : headerDefaultColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          gap: '2rem',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #CED4DA',
          cursor: 'pointer'
        }}
      >
        <div
          style={{
            transitionDuration: '500ms',
            transform: isCurrentEventKey ? 'rotate(0.25turn)' : 'rotate(0turn)'
          }}
        >
          <ArrowVectorRight />
        </div>
        <IndeterminateCheckbox
          label={children}
          name={`${field.name}-${eventKey}`}
          checked={checkWatch?.length === _totalOptionCounts}
          indeterminate={
            checkWatch?.length !== 0 && checkWatch?.length < _totalOptionCounts
          }
          className='form-check-inline'
          onChange={(e) => handleToggleCheckAll(e, eventKey)}
          onClick={(e) => e.stopPropagation()} // 阻止縮放事件
        />
        <div
          style={{
            flex: '1 0 auto',
            height: '1.5rem'
          }}
        ></div>
      </div>
    );
  };

  /** 父 checkbox 勾選 */
  const handleToggleCheckAll = (e, eventKey) => {
    if (e.target.checked) {
      // 更新 form 表單的值
      const _totalOptions = options?.[eventKey]?.children;
      const _totalChecked = _totalOptions?.map((ele) => ele?.value);

      const originData = methods.getValues(field.name);
      const checkWatch = originData?.length
        ? originData?.filter((_fieldValue) => {
            return !_totalOptions
              ?.map((_totalOption) => _totalOption?.value)
              ?.includes(_fieldValue);
          })
        : [];

      methods.setValue(field.name, [...checkWatch, ..._totalChecked]);
      // 更新 checkedState 的值
      const childrenState = _totalChecked?.reduce((_accChild, _curChild) => {
        return {
          ..._accChild,
          [_curChild]: true
        };
      }, {});
      setCheckedState((prev) => ({ ...prev, ...childrenState }));
    } else {
      // 更新 form 表單的值
      const originData = methods.getValues(field.name);
      const _totalOptions = options?.[eventKey]?.children;
      const _totalChecked = _totalOptions?.map((ele) => ele.value);
      methods.setValue(field.name, [
        ...originData?.filter((_fieldValue) => {
          return !_totalOptions
            ?.map((_totalOption) => _totalOption?.value)
            ?.includes(_fieldValue);
        })
      ]);
      // 更新 checkedState 的值
      const childrenState = _totalChecked?.reduce((_accChild, _curChild) => {
        return {
          ..._accChild,
          [_curChild]: false
        };
      }, {});
      setCheckedState((prev) => ({ ...prev, ...childrenState }));
    }
  };

  /** 子 checkbox 勾選 */
  const handleChange = (val, isChecked) => {
    setCheckedState((prev) => ({ ...prev, [val]: isChecked }));
    const originalChecked = field?.value ?? [];
    isChecked
      ? field.onChange([...originalChecked, val])
      : field.onChange([...originalChecked.filter((ele) => ele !== val)]);
  };

  return (
    <div className='h-100 py-2' style={{ width: fieldWidth }}>
      <Accordion defaultActiveKey='accordion_0' alwaysOpen>
        {options?.map((_option, index) => {
          return (
            <div key={`accordion_${index}`}>
              <ContextHeaderToggle eventKey={index}>
                {_option?.label}
              </ContextHeaderToggle>
              <Accordion.Collapse eventKey={index}>
                <div
                  style={{
                    padding: '1rem 1rem 1rem 4rem'
                  }}
                >
                  {_option?.children?.map((_optionChild) => {
                    return (
                      <Fragment key={`${_optionChild.value}`}>
                        <Form.Check
                          name={field.name}
                          id={`${field.name}-${_optionChild.value}`}
                          type='checkbox' // Change type to checkbox
                          inline
                          onChange={(e) =>
                            handleChange(_optionChild.value, e.target.checked)
                          }
                          onBlur={field.onBlur}
                          isInvalid={isInvalid}
                          isValid={isValid}
                          label={_optionChild.label}
                          value={_optionChild.value}
                          checked={checkedState[_optionChild.value] || false}
                          {...rest}
                        />
                      </Fragment>
                    );
                  })}
                </div>
              </Accordion.Collapse>
            </div>
          );
        })}
      </Accordion>
    </div>
  );
};

export default memo(AccordionCheckbox);
