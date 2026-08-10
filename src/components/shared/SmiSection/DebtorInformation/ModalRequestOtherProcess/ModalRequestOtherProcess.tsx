import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from './ModalRequestOtherProcess.constants';

import type { ModalRequestOtherProcessProps } from './ModalRequestOtherProcess.types';


const ModalRequestOtherProcess = NiceModal.create(({
  data,
}: ModalRequestOtherProcessProps) => {
  const modalId = modal.REQUEST_OTHER_PROCESS;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  return (
    <SectionModal
      title="Request Other Process"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      closeBtnText="Cancel"
      containerSx={{ maxWidth: '1100px' }}
    >
      <Box sx={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {
          data.map((dt, index) =>
            <Button
              key={index}
              variant="contained"
              color="success"
              isFull
              isLoading={dt.isLoading}
              disabled={dt.isLoading || dt.isDisabled}
              onClick={dt.onSubmit}
            >
              {dt.label}
            </Button>
          )
        }
      </Box>
    </SectionModal>
  );
});

export default ModalRequestOtherProcess;
