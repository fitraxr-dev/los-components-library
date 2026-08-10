'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useReturnToMakerModal from './ReturnToMakerModal.hook';


const ReturnToMakerModal = NiceModal.create(() => {
  const { control, onSave } = useReturnToMakerModal();
  const modalId = 'MODAL_RETURN_TO_MAKER_VA';
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
        color="info"
        onClick={onSave((data) => {
          closeNiceModal(modalId);
        })}
      >
        Submit
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Return to Maker"
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
              placeholder="Enter comment for return to maker"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ReturnToMakerModal;
