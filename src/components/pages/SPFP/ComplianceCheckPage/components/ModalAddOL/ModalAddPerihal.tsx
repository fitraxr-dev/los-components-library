import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


import { modal } from '../../ComplianceCheck.constants';

import { useAddPerihalModal } from './ModalAddPerihal.hook';

import type { ModalAddProps } from './ModalAddPerihal.types';


const ModalAddPerihal = NiceModal.create((props: ModalAddProps) => {
  const theme = useTheme();
  const modalId = modal.MODAL_ADD_PERIHAL;
  const isModal = useModal(modalId);

  const INITIAL_VALUES = {
    perihal: '',
  };

  const { control, handleSubmit, watch } = useForm({
    defaultValues: INITIAL_VALUES,
    mode: 'onChange',
  });

  const perihalValue = watch('perihal');
  const isPerihalEmpty = !perihalValue || perihalValue.trim() === '';

  const {
    handleOnSave,
    isSaveLoading,
  } = useAddPerihalModal(props);

  return (
    <SectionModal
      title="Add Perihal"
      isOpen={isModal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '30vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Controller
          name="perihal"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="text"
              placeholder="Input Perihal"
            />
          )}
        />
        <RowWrapper py={3} gap={2} justifyContent="end">
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            isLoading={isSaveLoading}
            onClick={handleSubmit(handleOnSave)}
            disabled={isPerihalEmpty}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalAddPerihal;
