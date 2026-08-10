import { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import { modal } from '../../ProjectInformation.constant';


const useModalProjectPhase = () => {
  const theme = useTheme();
  const modalId = modal.PROJECT_PHASE;
  const { visible } = useModal(modalId);

  const { control, handleSubmit, reset } = useForm({
    mode: 'onTouched',
  });
  return {
    control,
    modalId,
    theme,
    visible,
  };
};

export default useModalProjectPhase;
