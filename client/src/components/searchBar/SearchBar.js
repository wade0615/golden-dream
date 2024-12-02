import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import FilterIcon from 'assets/icons/FilterIcon';
import { MdSearch, MdClose } from 'react-icons/md';

import './searchBarStyle.scss';
import { useEffect } from 'react';

/**
 * 搜尋搜尋區
 * @param {string} name
 * @param {string} placeholder
 * @param {boolean} isAdvanceSearchBtn 是否為高級搜索
 * @param {boolean} isAdvanceOpen 是否展開高級搜索區
 * @param {*} className 額外 CSS
 * @param {function} toggleOpen handle 高級搜索區 展開事件
 * @param {function} onSearch handle 搜尋 事件
 * @returns
 */
const SearchBar = ({
  name = 'search',
  placeholder = '關鍵字',
  isAdvanceSearchBtn = false,
  isAdvanceOpen = false,
  className,
  toggleOpen = (f) => f,
  onSearch = null,
  right = false,
  minWidth = '204px',
  ...rest
}) => {
  const { register, watch, resetField } = useFormContext();
  const watchSearch = watch(name);
  const [isClearBtn, serIsClearBtn] = useState();

  const handleSearch = () => onSearch && onSearch();

  useEffect(() => {
    serIsClearBtn(!!watchSearch?.length);
  }, [watchSearch]);
  return (
    <div className={right ? 'text-end' : ''}>
      <div className={`search-bar ${className}`} style={{ minWidth }}>
        <input
          id={name}
          type='text'
          placeholder={placeholder}
          autoComplete='off'
          {...register(name)}
          {...rest}
        />
        {isClearBtn && (
          <button type='button' onClick={() => resetField(name)}>
            <MdClose size='1.5rem' />
          </button>
        )}
        <button type={!onSearch ? 'submit' : 'button'} onClick={handleSearch}>
          <MdSearch size='1.5rem' />
        </button>
      </div>
      {!!isAdvanceSearchBtn && (
        <button
          className={classNames({
            'advance-search-icon': true,
            active: isAdvanceOpen
          })}
          type='button'
          onClick={toggleOpen}
        >
          <FilterIcon />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
