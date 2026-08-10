import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import { modalAnnualReview } from '../../List.constants';


const useModalTableDk = () => {
  const theme = useTheme();
  const modalId = modalAnnualReview.MODAL_TABLE_DK;
  const { visible } = useModal(modalId);

  const handleOpenAddNewModal = () => {
    closeNiceModal(modalAnnualReview.MODAL_TABLE_DK);
    NiceModal.show(modalAnnualReview.ADD_NEW, {});
  };

  return {
    handleOpenAddNewModal,
    modalId,
    theme,
    visible,
  };
};


export default useModalTableDk;
