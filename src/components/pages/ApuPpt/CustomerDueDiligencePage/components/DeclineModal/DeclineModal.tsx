import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../CustomerDueDiligance.constants';

import { useDeclineModal } from './DeclineModal.hook';


const DeclineModal = NiceModal.create(() => {
  const theme = useTheme();
  const modalId = modal.CUSTOMER_DECLINE;
  const { visible } = useModal(modalId);

  const { handleOnSave, declineLoading, declinePayload, setDeclinePayload } = useDeclineModal({ modalId });


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
        <Input
          type="radio"
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
          value={declinePayload.action}
          onChange={(e) => setDeclinePayload((prev) => ({
            ...prev,
            action: e.target.value,
          }))}
          isMandatory
          disabled={declineLoading}
        />
        <Input
          type="area"
          placeholder="Input Comment"
          rows={4}
          value={declinePayload.comment}
          onChange={(value) => setDeclinePayload((prev) => ({
            ...prev,
            comment: value,
          }))}
          disabled={declineLoading}

        />
        <RowWrapper py={3} gap={2} justifyContent="end">
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            isLoading={declineLoading}
            onClick={handleOnSave}
            disabled={!declinePayload.action && !declinePayload?.comment}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default DeclineModal;
