import { memo } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import './advanceSectionStyle.scss';

/**
 * Description 進階搜尋區域
 * @param {JSX} children
 * @param {Boolean} [isOpen=false] -進階搜尋是否展開
 * @param {Function} onClose -關閉進階搜尋
 * @param {Function} onClear -清除搜尋條件
 * @param {Function} onSearch - 搜尋
 */
const AdvanceSection = ({
  children = '',
  isOpen = false,
  onClose = (f) => f,
  onClear = (f) => f,
  onSearch = null
}) => {
  const handleSearch = () => onSearch && onSearch();
  return (
    <Collapse in={isOpen}>
      <div className='advance-search-section'>
        {children}
        <div className='w-100 d-flex justify-content-end gap-3 mt-2'>
          <Button
            variant='outline-primary'
            size='sm'
            type='button'
            onClick={onClose}
          >
            關閉進階搜尋
          </Button>
          <Button
            variant='outline-primary'
            size='sm'
            type='button'
            onClick={onClear}
          >
            清除設定條件
          </Button>
          <Button
            size='sm'
            type={!onSearch ? 'submit' : 'button'}
            onClick={handleSearch}
          >
            開始搜尋
          </Button>
        </div>
      </div>
    </Collapse>
  );
};

export default memo(AdvanceSection);
