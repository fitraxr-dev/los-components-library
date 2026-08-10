import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';

import { useAddOLModal } from './ModalAddOL.hook';

import type { ModalAddProps } from './ModalAddOL.types';


const ModalAddOL = NiceModal.create((props: ModalAddProps) => {
  const theme = useTheme();
  const modalId = modal.MODAL_ADD_OL;
  const isModal = useModal(modalId);

  const isEditMode = !!props.editData;

  const INITIAL_VALUES = {
    nameOL: props.editData?.nameOL || '',
  };

  const { control, handleSubmit, watch } = useForm({
    defaultValues: INITIAL_VALUES,
    mode: 'onTouched',
  });

  const isMandatoryEmpty = !watch('nameOL');

  const {
    handleOnSave,
    isSaveLoading,
  } = useAddOLModal(props);

  return (
    <SectionModal
      title={isEditMode ? 'Edit OL' : 'Add OL'}
      isOpen={isModal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '30vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Controller
          name="nameOL"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              placeholder="Input Nama OL"
              label="Nama OL"
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
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalAddOL;
