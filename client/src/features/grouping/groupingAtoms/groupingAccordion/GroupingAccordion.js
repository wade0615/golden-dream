import { memo, useState } from 'react';
import {
  UnionIcon,
  IntersectionIcon,
  CloseIcon,
  ArrowVectorRight
} from 'assets/icons';
import { groupingOptions } from '../../groupingConfig';
import { useGroupingContext } from '../../groupingHooks/grouping-hook';

import './GroupingAccordionStyle.scss';
import classNames from 'classnames';

/**
 * Description 分群主分類
 * @param {Array} conditionType 新增的主分類:['condition', 'type']
 * condition: 'AND' / 'OR'
 * type: 'basic' / 'memberActivities' / 'consume' (來源:config.groupingOptions)
 * @param {Function} onDelete 刪除的function
 * @param {Boolean} hasDeleteBtn 是否有刪除按鈕
 * @param {Boolean} defaultOpen 初始是否展開
 */
function GroupingAccordion({
  conditionType = [],
  onDelete = (f) => f,
  //   settingIndex = 0,
  defaultOpen = true,
  hasDeleteBtn = true,
  children = null
}) {
  const _color = '#5e6366';
  const _type = groupingOptions.reduce(
    (acc, cur) => ({ ...acc, [cur.value]: cur.label }),
    {}
  ); //主分類文字 map

  const [open, setOpen] = useState(defaultOpen);
  const { disabled } = useGroupingContext();
  const handleToggleOpen = () => {
    setOpen((prev) => !prev);
  };

  if (!Array.isArray(conditionType)) return;
  return (
    <div className='grouping-accordion'>
      <div className='grouping-accordion__head'>
        <button
          type='button'
          className={classNames({
            'grouping-accordion__head--arrow': true,
            'is-close': !open
          })}
          onClick={handleToggleOpen}
        >
          <ArrowVectorRight color={_color} />
        </button>
        <div className='grouping-accordion__head--text'>
          {conditionType[0] === 'AND' ? (
            <IntersectionIcon color={_color} />
          ) : (
            <UnionIcon color={_color} />
          )}
          <span>{_type[conditionType[1]]}</span>
        </div>

        {hasDeleteBtn && !disabled && (
          <button type='button' onClick={onDelete}>
            <CloseIcon size='20px' color={_color} data-recounting />
          </button>
        )}
      </div>
      <div
        className={classNames({
          'grouping-accordion__section': true,
          'is-close': !open
        })}
      >
        {children}
      </div>
    </div>
  );
}

export default memo(GroupingAccordion);
