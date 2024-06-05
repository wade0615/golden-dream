import classNames from 'classnames';
import { Button } from 'react-bootstrap';

function DefaultFooter({
  onDelete = null,
  onCancel = null,
  onSave = null,
  onSaveText = '儲存',
  onCancelText = '取消',
  isHidden = false,
  disabledSaveBtn = false,
  hiddenSaveBtn = false,
  disabledDeleteBtn = false,
  children
}) {
  return (
    <div className={classNames('default-footer', isHidden && 'hidden')}>
      <div>
        {onDelete && (
          <Button
            variant='outline-primary'
            type='button'
            onClick={onDelete}
            disabled={disabledDeleteBtn}
          >
            刪除
          </Button>
        )}
      </div>

      <div>
        {onCancel && (
          <Button variant='outline-primary' type='button' onClick={onCancel}>
            {onCancelText}
          </Button>
        )}
        {children}
        <Button
          type={!onSave ? 'submit' : 'button'}
          onClick={onSave}
          disabled={disabledSaveBtn}
          hidden={hiddenSaveBtn}
        >
          {onSaveText}
        </Button>
      </div>
    </div>
  );
}

export default DefaultFooter;
