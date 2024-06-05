import { memo, useState } from 'react';
import classNames from 'classnames';
import { MdCancel } from 'react-icons/md';
import './tagChip.scss';

function TagChip({
  id = '',
  label = 'text',
  fontSize,
  width,
  fontColor = '#fff',
  bgColor,
  rounded = false,
  onDelete = null,
  outline = false,
  iconSize = '20px',
  clickable = false, // 控制是否可點擊
  onChipClick = null, // 點擊事件處理函數
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false); // 跟踪是否懸停

  return (
    <div
      className={classNames({
        'tag-chip': true,
        'chip-bg': true,
        'chip-rounded': rounded
      })}
      style={{
        fontSize: fontSize,
        width: width,
        backgroundColor: isHovered
          ? outline
            ? bgColor
            : fontColor
          : outline
          ? fontColor
          : bgColor,
        border: outline ? `solid 1px ${bgColor}` : 'none',
        cursor: clickable ? 'pointer' : 'default'
      }}
      onClick={clickable ? () => onChipClick(id) : null}
      onMouseEnter={clickable ? () => setIsHovered(true) : null}
      onMouseLeave={clickable ? () => setIsHovered(false) : null}
    >
      <span
        className={classNames({
          'chip-text': true
        })}
        style={{
          color: isHovered
            ? outline
              ? fontColor
              : bgColor
            : outline
            ? bgColor
            : fontColor
        }}
      >
        {label}
      </span>
      {onDelete && (
        <button
          type='button'
          onClick={() => onDelete(id)}
          hidden={rest?.hidden}
        >
          <MdCancel
            style={{
              color: isHovered
                ? outline
                  ? fontColor
                  : bgColor
                : outline
                ? bgColor
                : fontColor,
              width: iconSize,
              height: iconSize
            }}
          />
        </button>
      )}
    </div>
  );
}

export default memo(TagChip);
