import classNames from 'classnames';
import { useEffect } from 'react';

function Toast({
  variant = 'success',
  message = '修改成功',
  onClose = null,
  show = false,
  delay = 3000,
  autoHide = true,
  callBackFn = null
}) {
  //   const [isShow, setIsShow] = useState(show);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        // setIsShow(false);
        if (callBackFn) {
          callBackFn();
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay, callBackFn]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    // setIsShow(false);
  };

  return (
    <>
      <div className='toast-container position-fixed top-0 end-0 p-3'>
        <div
          className={classNames(
            'toast',
            'align-items-center',
            'border-0',
            `text-bg-${variant}`,
            show && autoHide && 'show'
          )}
          role='alert'
          aria-live='assertive'
          aria-atomic='true'
        >
          <div className='d-flex'>
            <div className='toast-body text-white'>{message}</div>
            <button
              type='button'
              className='btn-close btn-close-white me-2 m-auto'
              data-bs-dismiss='toast'
              aria-label='Close'
              onClick={handleClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Toast;
