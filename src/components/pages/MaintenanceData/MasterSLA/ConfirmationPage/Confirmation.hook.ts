import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';

import { modal } from '../constants';


export function useConfirmation() {
  const handleRejectModal = () => {
    NiceModal.show(modal.REJECT_MODAL);
  };
  const handleSubmitModal = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT);
  };
  return {
    handleRejectModal,
    handleSubmitModal,
  };
}
