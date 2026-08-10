'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useAddNewValidasi from './AddNewValidasi.hook';


const AddNewValidasi = NiceModal.create(() => {
  const { control, onSave } = useAddNewValidasi();
  const modalId = 'MODAL_ADD_VALIDASI';
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
        onClick={onSave((data) => {
          closeNiceModal(modalId);
        })}
      >
        Save
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Add New Validasi"
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
          name="parameterName"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Parameter Name"
              placeholder="Enter Parameter Name"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Status"
              placeholder="Enter Status"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="validatedBy"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Validated By"
              placeholder="Enter Validated By"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="validatedDate"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="date"
              label="Validated Date"
              placeholder="Enter Validated Date"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Notes"
              placeholder="Enter Notes"
              multiline
              rows={3}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});

export default AddNewValidasi;
