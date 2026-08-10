'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';

import { DEPI_DIVISION, DH_DIVISION } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import NotificationSection from './components/NotificationSection';
import { tableHeaderSelectedPipeline } from './ModalNotificationFastTrack.constants';
import useModalNotificationFastTrack from './ModalNotificationFastTrack.hook';

import type { ModalNotificationFastTrackProps, NotificationFormValues } from './ModalNotificationFastTrack.types';


const ModalNotificationFastTrack = NiceModal.create(({
  onSave,
  pipelineDetail,
  processId,
}: ModalNotificationFastTrackProps) => {
  const modalId = MODAL.FAST_TRACK.NOTIFICATION;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const methods = useForm<NotificationFormValues>({
    defaultValues: {
      depiStaff: [],
      dhStaff: [],
    },
    mode: 'onChange',
  });

  const { isSaveDisabled, tableDataSelectedPipeline } = useModalNotificationFastTrack({
    control: methods.control,
    pipelineDetail,
    processId,
  });

  const footer = (
    <RowWrapper
      gap={theme.spacing(3)}
      justifyContent="end"
      paddingTop={theme.spacing(3)}
      sx={{
        borderColor: theme.palette.custom.gray30,
        borderTop: '0.1vw solid',
      }}
    >
      <Button
        variant="outlined"
        onClick={() => closeNiceModal(modalId)}
      >
        Cancel
      </Button>
      <Button
        disabled={isSaveDisabled}
        onClick={methods.handleSubmit(onSave)}
      >
        Save
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Notification"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={footer}
      containerSx={{
        maxHeight: '90vh',
        minWidth: '72vw',
      }}
    >
      <FormProvider {...methods}>
        <ColumnWrapper gap={theme.spacing(3)}>
          <ColumnWrapper gap={theme.spacing(3)}>
            <SectionTitle title="Selected Pipeline" />
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                isLoading={false}
                tableHeader={tableHeaderSelectedPipeline}
                tableData={tableDataSelectedPipeline}
              />
            </BaseContainer>
          </ColumnWrapper>

          <NotificationSection
            division={DEPI_DIVISION}
            name="depiStaff"
            title="Notification to DEPI"
          />
          <NotificationSection
            division={DH_DIVISION}
            name="dhStaff"
            title="Notification to DH"
          />
        </ColumnWrapper>
      </FormProvider>
    </SectionModal>
  );
});


export default ModalNotificationFastTrack;
