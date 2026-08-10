import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';


type ShowNiceModalV2Type = {
  customProp?: Object;
  type: 'success' | 'warning' | 'error';
  title?: string | React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  submitText?: string;
  cancelText?: string;
}

const showNiceModalV2 = ({
  customProp,
  type,
  title,
  onSubmit = () => {},
  onCancel = () => {},
  onClose = () => {},
  submitText,
  cancelText,
}: ShowNiceModalV2Type) => {
  switch (type) {
    case 'warning':
      NiceModal.show(MODAL.GLOBAL.CONFIRM, {
        agreeText: submitText,
        cancelText,
        customProp,
        onCancel,
        onSubmit,
        title,
      });
      break;
    case 'error':
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        customProp,
        onClose,
        title,
      });
      break;
    default:
      NiceModal.show(MODAL.GLOBAL.SUCCESS, {
        onClose,
        title,
      });
      break;
  }
};

export default showNiceModalV2;
