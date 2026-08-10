import NiceModal from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import { modal } from '../../Request.constants';


const useModalTableDk = () => {

  const handleOpenAddNewModal = () => {
    closeNiceModal(modal.MODAL_TABLE_DK);
    NiceModal.show(modal.DEBTOR, {});
  };


  return {
    handleOpenAddNewModal,
  };
};


export default useModalTableDk;
