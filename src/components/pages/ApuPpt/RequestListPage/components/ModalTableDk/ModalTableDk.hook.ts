import NiceModal from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import { modal } from '../../RequestList.constants';


const useModalTableDk = () => {

  const handleOpenAddNewModal = () => {
    closeNiceModal(modal.MODAL_TABLE_DK);
    NiceModal.show(modal.ADD_NEW_MODAL, {});
  };


  return {
    handleOpenAddNewModal,
  };
};


export default useModalTableDk;
