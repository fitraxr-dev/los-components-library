import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { Box, CircularProgress, useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal, processList } from './ModalRequestOtherProcess.constants';
import useModalRequestOtherProcess from './ModalRequestOtherProcess.hook';


const ModalRequestOtherProcess = create(() => {
  const theme = useTheme();
  const modalId = modal.REQUEST_OTHER_PROCESS;
  const { visible } = useModal(modalId);
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const {
    handleOnClickProcess,
    isCheckAvailableRequestLoading,
    getDisabledStatusRequestOtherProcess,
  } = useModalRequestOtherProcess();

  const handleModalClose = () => {
    recordActivity({
      activity: ActivityType.CANCEL,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({ action: 'close', modal: 'REQUEST_OTHER_PROCESS' }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP_ANALYST,
      remarks: 'close request other process modal from MUP Analyst',
    });
    closeNiceModal(modalId);
  };

  return (
    <SectionModal
      title="Request Other Process"
      isOpen={visible}
      onClose={handleModalClose}
      closeBtnText="Cancel"
      containerSx={{ maxWidth: '1100px' }}
    >
      <Box sx={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {isCheckAvailableRequestLoading ? (
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
        ) : (
          processList.map((process) =>
            <Button
              key={process.name}
              variant="contained"
              color="success"
              isFull
              isLoading={isCheckAvailableRequestLoading}
              disabled={getDisabledStatusRequestOtherProcess(process.process) || isCheckAvailableRequestLoading}
              onClick={() => handleOnClickProcess(process)}
            >
              {process.name}
            </Button>
          )
        )}
      </Box>
    </SectionModal>
  );
});

export default ModalRequestOtherProcess;
