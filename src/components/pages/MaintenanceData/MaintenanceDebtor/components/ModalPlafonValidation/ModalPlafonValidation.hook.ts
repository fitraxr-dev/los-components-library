import { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material/styles';

import { loanProcessingSummary } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';

import { modal as MODAL } from '../ActionFooterDetail/ActionFooterDetail.constant';


const useModalPlafonValidation = () => {
  const theme = useTheme();
  const modalId = MODAL.PLAFON_VALIDATION;
  const modal = useModal(modalId);

  const handleOpenBcmError = (item: string) => {
    const url = replacePath(loanProcessingSummary.FINANCING_FACILITY, {
      processId: item,
    });
    window.open(url, '_blank');
  };


  return {
    handleOpenBcmError,
    modal,
    modalId,
    theme,
  };
};

export default useModalPlafonValidation;
