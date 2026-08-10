'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useAddNewSummary from './AddNewSummary.hook';


const AddNewSummary = NiceModal.create(() => {
  const { control, onSave } = useAddNewSummary();
  const modalId = 'MODAL_ADD_SUMMARY';
  const modal = useModal(modalId);

  const isTL = false;

  const footer = (
    <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 5 }}>
      <Button
        variant="outlined"
        onClick={() => closeNiceModal(modalId)}
      >
        Cancel
      </Button>
      <Button
        color="success"
        onClick={onSave((data) => {
          closeNiceModal(modalId);
        })}
      >
        {isTL ? 'Approve' : 'Submit'}
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Add New Summary"
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
          name="category"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Category"
              placeholder="Enter Category"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="totalRecords"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="number"
              label="Total Records"
              placeholder="Enter Total Records"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="activeRecords"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="number"
              label="Active Records"
              placeholder="Enter Active Records"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="inactiveRecords"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="number"
              label="Inactive Records"
              placeholder="Enter Inactive Records"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastUpdated"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="date"
              label="Last Updated"
              placeholder="Enter Last Updated"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});

export default AddNewSummary;
