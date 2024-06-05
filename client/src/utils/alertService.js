import Swal from 'sweetalert2';

const alertService = {};

const _iconType = {
  success: 'success',
  danger: 'error',
  warning: 'warning',
  info: 'info',
  question: 'question'
};

/* 成功與錯誤 toast */
const toast = (params = {}) => {
  const { title = '儲存成功', time = 1500, type = 'success', ...rest } = params;
  return Swal.fire({
    toast: true,
    title: title,
    icon: _iconType[type],
    iconHtml: '',
    iconColor: 'white',
    position: 'top-right',
    showConfirmButton: false,
    showCloseButton: true,
    timer: time,
    timerProgressBar: true,
    ...rest,
    showClass: {
      icon: '',
      popup: 'animate__animated animate__fadeInDownBig animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster'
    },
    customClass: {
      popup: `toast text-bg-${type} border-0 text-white`,
      closeButton: 'text-white'
    }
  });
};

/* 確認彈窗 */
const confirm = (params = {}) => {
  const {
    title = '提醒',
    text = '確認刪除？',
    showCancelButton = true,
    showCloseButton = true,
    confirmButtonText = '確定',
    cancelButtonText = '取消',
    ...rest
  } = params;
  return Swal.fire({
    title: title,
    text,
    showCancelButton,
    showCloseButton,
    confirmButtonText,
    cancelButtonText,
    buttonsStyling: false, // Disable the default button styling
    reverseButtons: true,
    ...rest,
    customClass: {
      title: 'fs-4 text-start',
      htmlContainer: 'text-start',
      cancelButton: 'btn btn-outline-primary me-2',
      confirmButton: 'btn btn-primary'
    },
    showClass: {
      icon: '',
      popup: ''
    },
    hideClass: {
      popup: ''
    }
  });
};

alertService.toast = toast;
alertService.confirm = confirm;

export default alertService;
