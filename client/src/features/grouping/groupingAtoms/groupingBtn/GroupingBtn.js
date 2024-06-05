import { memo, useRef } from 'react';
import { groupingOptions } from '../../groupingConfig';

import './GroupingBtnStyle.scss';
import { AddIcon, UnionIcon, IntersectionIcon } from 'assets/icons';
import classNames from 'classnames';

/**
 * Description AND/OR 條件分群選擇器
 * @param {string} conditional='AND' 'AND' || 'OR'
 * @param {function} callBackFn 回傳點選的狀態 [conditional, value]
 * @param {boolean} disabled 是否禁用 | 預設: false
 * @param {boolean} hidden 是否隱藏 | 預設: false
 */
function GroupingBtn({
  conditional = 'AND',
  callBackFn = (f) => f,
  disabled = false,
  hidden = false
}) {
  const optionWrapperRef = useRef();
  const optionsWidth = optionWrapperRef?.current?.clientWidth ?? '130px';
  if (hidden) return null;
  return (
    <div className='grouping-btn'>
      <button
        className={classNames({
          'grouping-btn__btn': true,
          'is-disabled': disabled
        })}
        ref={optionWrapperRef}
        type='button'
        disabled={disabled}
      >
        <AddIcon />
        <p
          className={classNames({
            'grouping-btn__btn--text': true,
            'is-disabled': disabled
          })}
        >
          {conditional === 'AND' ? 'AND條件' : 'OR條件'}
        </p>
        {conditional === 'AND' ? (
          <IntersectionIcon color={disabled ? '#8FAEEE' : undefined} />
        ) : (
          <UnionIcon color={disabled ? '#8FAEEE' : undefined} />
        )}
      </button>
      {!disabled && (
        <ul className='grouping-btn__options' style={{ width: optionsWidth }}>
          {groupingOptions.map(({ value, label }) => (
            <li
              key={value}
              id={value}
              onClick={() => callBackFn([conditional, value])}
              data-recounting
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(GroupingBtn);
