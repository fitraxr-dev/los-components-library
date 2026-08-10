import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modalId as modalConstants } from './ModalAddExternalRating.constants';
import useModalAddExternalRating from './ModalAddExternalRating.hooks';


const ModalAddExternalRating = NiceModal.create((props: any) => {
  const modal = useModal();
  const modalId = modalConstants.MODAL_ADD_EXTERNAL_RATING;

  const { control, handleSubmit, handleAddExternalRating } = useModalAddExternalRating(props);

  return (
    <SectionModal
      title={
        props?.process === 'add' ?
          'Add New Rating' :
          'Edit Rating'
      }
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '28vw' }}
      onConfirm={() => {
        closeNiceModal(modalId);
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>

        <Controller
          name="ratingResult"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Hasil"
              placeholder="Masukkan Hasil"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
              }}
              error={!!formState.errors.ratingResult}
              helperText={formState.errors.ratingResult?.message}
            />
          )}
        />

        <Controller
          name="ratingDescription"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Keterangan"
              placeholder="Masukkan Keterangan"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
              }}
              type="area"
              rows={4}
              error={!!formState.errors.ratingDescription}
              helperText={formState.errors.ratingDescription?.message}
            />
          )}
        />

      </ColumnWrapper>
      <RowWrapper mt={3} sx={{ justifyContent: 'end' }}>
        <Button
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => {
            closeNiceModal(modalId);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleAddExternalRating)}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>

  );
},
);

export default ModalAddExternalRating;
