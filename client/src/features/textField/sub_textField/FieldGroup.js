import classNames from 'classnames';
import FormLabel from 'components/form/FormLabel';

function FieldGroup({
  htmlFor = '',
  title = '標題',
  toolTipText = '',
  required = false,
  className = '',
  children,
  isText = false,
  labelSize = 'md'
}) {
  return (
    <div className={`field-group ${className}`}>
      <div
        className={classNames({
          'field-group__left': true,
          isLarge: labelSize === 'lg'
        })}
      >
        {isText ? (
          <p>{title}</p>
        ) : (
          <FormLabel
            htmlFor={htmlFor}
            toolTipText={toolTipText}
            required={required}
          >
            {title}
          </FormLabel>
        )}
      </div>
      <div className='field-group__right'>{children}</div>
    </div>
  );
}

export default FieldGroup;
