import DefaultFooter from './DefaultFooter';

function DefaultOutlet({
  children,
  onDelete = null,
  onCancel = null,
  onSave = null,
  onSaveText = '儲存',
  onCancelText = '取消',
  disabledSaveBtn = false,
  disabledDeleteBtn = false,
  hiddenSaveBtn = false,
  withFooter = true,
  className = '',
  footerChildren,
  ...rest
}) {
  return (
    <div className={`default-wrapper ${className}`} {...rest}>
      <div className='default-content'>{children}</div>
      <DefaultFooter
        onCancel={onCancel}
        onDelete={onDelete}
        onSave={onSave}
        onSaveText={onSaveText}
        onCancelText={onCancelText}
        isHidden={!withFooter}
        disabledSaveBtn={disabledSaveBtn}
        disabledDeleteBtn={disabledDeleteBtn}
        hiddenSaveBtn={hiddenSaveBtn}
      >
        {footerChildren}
      </DefaultFooter>
    </div>
  );
}

export default DefaultOutlet;
