import { InfoIcon } from 'assets/icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';

/**
 * Description
 * @param {string} placement | tooltip位置 top | right | bottom | left
 * @param {string} type popover | tooltip
 * @param {string} trigger ['hover', 'focus'] | click
 */
function ToolTip({
  name = 'tooltip',
  children = 'text',
  placement = 'right',
  size = '16',
  type = 'popover',
  trigger = ['hover', 'focus'],
  popperConfig = {},
  width = '500px',
  ...rest
}) {
  let renderContent = null;
  switch (type) {
    case 'popover':
      renderContent = (
        <Popover id={name} style={{ maxWidth: '800px' }} {...rest}>
          <Popover.Body>{children}</Popover.Body>
        </Popover>
      );
      break;
    case 'tooltip':
    default:
      renderContent = (
        <Tooltip id={name} {...rest}>
          {children}
        </Tooltip>
      );
      break;
  }

  return (
    <OverlayTrigger
      key={placement}
      placement={placement}
      overlay={renderContent}
      trigger={trigger}
      popperConfig={popperConfig}
    >
      {({ ref, ...triggerHandler }) => (
        <button
          ref={ref}
          id={`tooltip-${placement}`}
          {...triggerHandler}
          type='button'
        >
          <InfoIcon size={size} />
        </button>
      )}
    </OverlayTrigger>
  );
}

export default ToolTip;
