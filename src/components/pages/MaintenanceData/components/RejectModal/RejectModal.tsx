import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../MaintenanceDataMaster/ListPage/List.constants';

import { useRejectModal } from './RejectModal.hook';


const RejectModal = NiceModal.create((props: any) => {
  const modalId = 'REJECT_MODAL';
  const theme = useTheme();
  const { visible } = useModal(modalId);

  const INITIAL_VALUES = {
    rejectReason: '',
  };

  const { control, handleSubmit, watch } = useForm({
    defaultValues: INITIAL_VALUES,
    mode: 'onTouched',
  });

  const isMandatoryEmpty = !watch('rejectReason');

  const {
    handleOnSave,
    isSaveLoading,
  } = useRejectModal({ modalId }, props);

  return (
    <SectionModal
      title="Reject Reason"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '30vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Controller
          name="rejectReason"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              placeholder="Choose Reject Reason"
              label="Reject Reason"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />
        <RowWrapper py={3} gap={2} justifyContent="end">
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
            disabled={isSaveLoading}
          >
            Cancel
          </Button>
          <Button
            isLoading={isSaveLoading}
            onClick={handleSubmit(handleOnSave)}
            disabled={isMandatoryEmpty}
            color="error"
          >
            Reject
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default RejectModal;
