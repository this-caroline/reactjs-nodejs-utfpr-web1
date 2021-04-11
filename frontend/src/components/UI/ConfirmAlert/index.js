import Swal from 'sweetalert2';

import { UNEXPECTED_ERROR_MSG } from '../../../utils/contants';

/**
 * Displays delete alert.
 * @param {Object} payload - Object with alert properties.
 * @param {Boolean} payload.hasLoading - If Alert has loading message.
 * @param {String} payload.confirmButtonText - Confirm button text.
 * @param {String} payload.cancelButtonText - Cancel button text.
 * @param {String} payload.title - Alert title.
 * @param {String} payload.text - Alert text.
 * @param {Function} payload.onConfirm - Function is triggered after user confirm deletion.
 */
const ConfirmAlert = (payload) => {
  const {
    hasLoading,
    confirmButtonText,
    cancelButtonText,
    title = 'Are you sure?',
    text,
    onConfirm,
  } = payload;

  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    allowEscapeKey: false,
    buttonsStyling: false,
    allowOutsideClick: false,
    customClass: {
      confirmButton: 'btn btn-success btn-md mr-2 mt-2',
      cancelButton: 'btn btn-danger btn-md mt-2',
    },
  })
    .then((result) => {
      if (result.isConfirmed) {
        if (hasLoading) {
          Swal.fire({
            text: 'Please wait...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }

        onConfirm();
      }
    })
    .catch(() => Swal.fire('Unexpected error', UNEXPECTED_ERROR_MSG, 'error'));
};

export default ConfirmAlert;
