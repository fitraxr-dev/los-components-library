import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { CANCELED, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalDecline from './ModalDecline.hook';


const defaultValues = {
  comment: '',
  status: '',
};

const ModalDecline = create(() => {
  const theme = useTheme();
  const modalId = MODAL.DECLINE;
  const { visible } = useModal(modalId);

  const { handleOnSave, isDeclineLoading } = useModalDecline();


  const { control, handleSubmit, watch } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  return (
    <SectionModal
      title="Comment"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '60vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Controller
          name="status"
          control={control}
          render={({ field: { ref, value, ...field } }) => (
            <Input
              type="radio"
              {...field}
              label="Declined"
              sx={{ flex: 1 }}
              radioList={[
                {
                  label: 'Canceled',
                  value: CANCELED,
                },
                {
                  label: 'Rejected',
                  value: REJECTED,
                }
              ]}
              value={value}
              isMandatory
              disabled={isDeclineLoading}
            />
          )}
        />
        <Controller
          name="comment"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="area"
              placeholder="Input Comment"
              rows={3}
              multiline
              disabled={isDeclineLoading}
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
            isLoading={isDeclineLoading}
            onClick={handleSubmit(handleOnSave)}
            disabled={!watch('status') || isDeclineLoading}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalDecline;
