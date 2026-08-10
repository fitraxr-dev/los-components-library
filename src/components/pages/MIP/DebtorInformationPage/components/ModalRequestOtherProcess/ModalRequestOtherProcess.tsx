import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, CircularProgress, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from './ModalRequestOtherProcess.constants';
import useModalRequestOtherProcess from './ModalRequestOtherProcess.hook';

import type { ModalRequestOtherProcessProps } from './ModalRequestOtherProcess.types';


const ModalRequestOtherProcess = NiceModal.create((props: ModalRequestOtherProcessProps) => {
  const modalId = modal.REQUEST_OTHER_PROCESS;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const {
    requestOptions,
    handleOnClickOption,
    isCheckAvailableRequestLoading,
  } = useModalRequestOtherProcess(props);

  return (
    <SectionModal
      title="Request Other Process"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      closeBtnText="Cancel"
      containerSx={{ maxWidth: '1100px' }}
    >


      <Box sx={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(3, 1fr)' }}>
        { !isCheckAvailableRequestLoading ?
          (requestOptions?.map((option, index) =>
            <Button
              key={index}
              variant="contained"
              color="success"
              isFull
              isLoading={isCheckAvailableRequestLoading}
              disabled={option.isDisabled || isCheckAvailableRequestLoading}
              onClick={() => handleOnClickOption(option)}
            >
              {option.label}
            </Button>
          )) : (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                gridColumn: '1 / -1',
                height: '15vh',
                justifyContent: 'center',
              }}
            >
              <CircularProgress color="primary" size={theme.typography.body1.fontSize} />
            </Box>

          )
        }
      </Box>
    </SectionModal>
  );
});

export default ModalRequestOtherProcess;
