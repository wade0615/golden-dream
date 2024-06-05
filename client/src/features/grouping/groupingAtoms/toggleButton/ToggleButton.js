import { useState, memo } from 'react';
import { useFormContext } from 'react-hook-form';
import './ToggleButtonStyle.scss';
import classNames from 'classnames';

/**
 * 分群 且/或 按鈕
 * @param {string} name='toggle'
 * @param {string} defaultState='AND' AND || OR
 * @param {function} callBackFn //回傳Array [condition, ]
 */

function ToggleButton({
  name = 'toggle',
  defaultCondition = 'AND',
  callBackFn = (f) => f,
  disabled = false,
  ...rest
}) {
  const methods = useFormContext();
  const [condition, setCondition] = useState(defaultCondition);
  const _mapString = {
    AND: '且',
    OR: '或'
  };
  const handleToggle = (e) => {
    if (condition !== 'AND') {
      setCondition('AND');
      methods.setValue(name, 'AND');
      callBackFn('AND');
    } else {
      setCondition('OR');
      methods.setValue(name, 'OR');
      callBackFn('OR');
    }
  };
  return (
    <input
      name={name}
      className={classNames({
        'toggle-btn': true,
        'is-disabled': disabled
      })}
      type='button'
      onClick={!disabled ? handleToggle : (f) => f}
      disabled={disabled}
      value={_mapString[condition]}
      {...rest}
    />
  );
}

export default memo(ToggleButton);
