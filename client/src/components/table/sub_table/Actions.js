import IconButton from 'components/button/iconButton/IconButton';
import {
  PenIcon,
  EyeIcon,
  TrashIcon,
  CopyIcon,
  CheckCircleIcon,
  CloseIcon,
  DownloadIcon
} from 'assets/icons';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import StopIcon from 'assets/icons/StopIcon';

function Actions({ children, isShown = false }) {
  return (
    <div className={classNames({ 'hover-actions': true, isShown: isShown })}>
      {children}
    </div>
  );
}

const EditAction = ({
  iconColor = '#000',
  iconSize = '18',
  onClick = (f) => f,
  type = 'button',
  ...rest
}) => (
  <IconButton onClick={onClick} type={type} {...rest}>
    <PenIcon color={iconColor} size={iconSize} />
  </IconButton>
);

const DeleteAction = ({
  iconColor = '#000',
  iconSize = '18',
  onClick = (f) => f,
  type = 'button',
  ...rest
}) => (
  <IconButton onClick={onClick} type={type} {...rest}>
    <TrashIcon color={iconColor} size={iconSize} />
  </IconButton>
);

const CloseAction = ({
  iconColor = '#000',
  iconSize = '24',
  onClick = (f) => f,
  type = 'button',
  ...rest
}) => (
  <IconButton onClick={onClick} type={type} {...rest}>
    <CloseIcon color={iconColor} size={iconSize} />
  </IconButton>
);

const ViewAction = ({
  iconColor = '#000',
  iconSize = '18',
  onClick = (f) => f,
  type = 'button',
  ...rest
}) => (
  <IconButton onClick={onClick} type={type} {...rest}>
    <EyeIcon color={iconColor} size={iconSize} />
  </IconButton>
);

const CopyAction = ({
  iconColor = '#000',
  iconSize = '18',
  onClick = (f) => f,
  type = 'button',
  ...rest
}) => (
  <IconButton onClick={onClick} type={type} {...rest}>
    <CopyIcon color={iconColor} size={iconSize} />
  </IconButton>
);

const ApproveAction = ({
  iconColor = '#000',
  iconSize = '18',
  onClick = (f) => f,
  type = 'button',
  ...rest
}) => (
  <IconButton onClick={onClick} type={type} {...rest}>
    <CheckCircleIcon color={iconColor} size={iconSize} />
  </IconButton>
);

const StopAction = ({
  iconColor = '#000',
  iconSize = '18',
  onClick = (f) => f,
  type = 'button',
  ...rest
}) => (
  <IconButton onClick={onClick} type={type} {...rest}>
    <StopIcon color={iconColor} size={iconSize} />
  </IconButton>
);

const SaveAction = ({
  variant = 'info',
  size = 'sm',
  onClick = (f) => f,
  label = '儲存',
  type = 'button'
}) => (
  <Button
    variant={variant}
    size={size}
    onClick={onClick}
    className='text-white'
    type={type}
  >
    {label}
  </Button>
);

const CancelAction = ({
  variant = 'outline-primary',
  size = 'sm',
  onClick = (f) => f,
  label = '取消',
  type = 'button'
}) => (
  <Button variant={variant} size={size} type={type} onClick={onClick}>
    {label}
  </Button>
);

const DownloadAction = ({
  iconColor = '#000',
  iconSize = '18',
  onClick = (f) => f,
  type = 'button',
  ...rest
}) => (
  <IconButton onClick={onClick} type={type} {...rest}>
    <DownloadIcon color={iconColor} size={iconSize} />
  </IconButton>
);

Actions.Edit = EditAction;
Actions.Delete = DeleteAction;
Actions.View = ViewAction;
Actions.Copy = CopyAction;
Actions.Approve = ApproveAction;
Actions.Stop = StopAction;
Actions.SaveBtn = SaveAction;
Actions.CancelBtn = CancelAction;
Actions.Close = CloseAction;
Actions.Download = DownloadAction;

export default Actions;
