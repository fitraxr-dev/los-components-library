import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionModal from '@/components/shared/Modal/SectionModal';
import RowWrapper from '@/components/shared/RowWrapper';

import { modal } from '../../TechnicalReviewRequest.constants';

import { DECLINE_INITIAL_VALUES } from './DeclineModal.constants';
import { useDeclineModal } from './DeclineModal.hook';


const DeclineModal = NiceModal.create(() => {
  const theme = useTheme();
  const modalId = modal.DECLINE;
  const { visible } = useModal(modalId);

  const { handleOnSave } = useDeclineModal({ modalId });

  const { control, handleSubmit, watch } = useForm({
    defaultValues: DECLINE_INITIAL_VALUES,
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
                  value: 'CANCELED',
                },
                {
                  label: 'Rejected',
                  value: 'REJECTED',
                }
              ]}
              value={value}
              isMandatory
              disabled={false}
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
              disabled={false}
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
            isLoading={false}
            onClick={handleSubmit(handleOnSave)}
            disabled={!watch('status')}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default DeclineModal;
