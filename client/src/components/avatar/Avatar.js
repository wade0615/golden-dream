import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './avatarStyle.scss';
// import api from 'services/api';
import { BiSolidUserCircle } from 'react-icons/bi';
import { MdOutlineExpandMore } from 'react-icons/md';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';

import ExceptionHandleService from 'utils/exceptionHandler';

const _EHS = new ExceptionHandleService({
  _NAME: 'components/avatar/Avatar.js',
  _NOTICE: ''
});

/**
 * Description
 * @param {String} imgUrl='' :圖片 url
 * @param {String} size='18px' :頭貼尺寸
 * @param {String} label='guest' :頭貼文字
 */
function Avatar({
  imgUrl = '',
  size = '18px',
  label = 'guest',
  isDropDown = false
}) {
  const [showDropDown, setShowDropDown] = useState(false);
  const dropDownRef = useRef(null);
  const clickedInside = useRef(false);
  const userInfo = localStorageUtil.getItem(LocalStorageKeys.UserInfo);
  const name = userInfo?.name || label;
  const isClickable = isDropDown && userInfo;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickedInside.current) {
        clickedInside.current = false;
        return;
      }
      if (
        showDropDown &&
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target)
      ) {
        setShowDropDown(false); // 如果彈窗是打開的且點擊發生在彈窗之外，則關閉它
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropDown]);

  const handleAvatarClick = () => {
    if (isClickable) {
      clickedInside.current = true;
      setShowDropDown(!showDropDown);
    }
  };
  const navigate = useNavigate();

  const logout = () => {
    try {
      if (!userInfo) return;
      (() => {
        // api.auth.logout();
        localStorageUtil.removeItem(LocalStorageKeys.UserInfo);
        navigate('/');
      })();
    } catch (error) {
      _EHS.errorReport(error, 'logout api', _EHS._LEVEL.ERROR);
    }
  };

  return (
    <div className='avatar-container'>
      <div
        className={`hstack gap-1 ${isClickable ? 'clickable' : ''}`}
        onClick={handleAvatarClick}
      >
        {!!imgUrl ? (
          <img
            width={size}
            height={size}
            className='avatar'
            alt=''
            src={imgUrl}
          />
        ) : (
          <BiSolidUserCircle size={size} color='var(--bs-secondary)' />
        )}
        <span className='avatar-text'>{name}</span>
        <MdOutlineExpandMore
          size='1.5rem'
          className={
            isClickable ? (showDropDown ? 'rotate-180' : 'rotate-0') : 'hidden'
          }
        />
      </div>
      {showDropDown && (
        <div className='avatar-menu' ref={dropDownRef}>
          <button onClick={logout}>登出</button>
        </div>
      )}
    </div>
  );
}

export default Avatar;
