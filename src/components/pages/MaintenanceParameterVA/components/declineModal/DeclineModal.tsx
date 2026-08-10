'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useDeclineModal from './DeclineModal.hook';


const DeclineModal = NiceModal.create(() => {
  const { control, onSave } = useDeclineModal();
  const modalId = 'MODAL_DECLINE_VA';
  const modal = useModal(modalId);

  const footer = (
    <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 5 }}>
      <Button
        variant="outlined"
        onClick={() => closeNiceModal(modalId)}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={onSave((data) => {
          closeNiceModal(modalId);
        })}
      >
        Decline
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Decline"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '24.5vw',
      }}
      customFooter={footer}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Controller
          control={control}
          name="comment"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="area"
              label="Comment"
              placeholder="Enter decline reason"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});

export default DeclineModal;
