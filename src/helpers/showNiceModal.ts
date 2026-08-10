import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';


function showNiceModal(type: 'success' | 'confirm' | 'error', title?: string, onSubmit?: () => void, cancelText?: string,
  agreeText?: string) {
  switch (type) {
    case 'confirm':
      NiceModal.show(MODAL.GLOBAL.CONFIRM, {
        agreeText,
        cancelText,
        onSubmit,
        title,
      });
      break;
    case 'error':
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title,
      });
      break;
    default:
      NiceModal.show(MODAL.GLOBAL.SUCCESS, {
        title,
      });
      break;
  }
}

export default showNiceModal;
