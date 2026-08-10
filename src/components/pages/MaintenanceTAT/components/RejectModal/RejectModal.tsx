import React, { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../TATDetailPage/TATDetail.constants';


type Props = {
  onReject: (reason: string) => any;
}


const RejectModal = NiceModal.create((props: Props) => {
  const theme = useTheme();
  const modalId = modal.REJECT_MODAL;
  const { visible } = useModal(modalId);
  const [rejectReason, setRejectReason] = useState('');

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '20vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 4 }}>
        <RowWrapper
          sx={{
            borderBottom: '0.1vw solid',
            borderColor: theme.palette.custom.gray30,
            justifyContent: 'center',
            p: 1,
          }}
        >
          <TextStyle variant="body1" weight={600} color={theme.palette.primary.main}>
            Reject Reason
          </TextStyle>
        </RowWrapper>

        <ColumnWrapper sx={{ gap: 3 }}>
          <Input
            type="dropdown"
            label="Reject Reason"
            placeholder="Choose Reject Reason"
            value={rejectReason}
            onChange={setRejectReason}
            dropdownList={[
              {
                label: 'Reason A',
                value: 'Reason A',
              },
              {
                label: 'Reason B',
                value: 'Reason B',
              },
            ]}
          />
        </ColumnWrapper>

        <RowWrapper sx={{ gap: 3, justifyContent: 'end' }}>
          <Button
            isFull
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            isFull
            color="error"
            disabled={!rejectReason}
            onClick={() => props?.onReject?.(rejectReason)}
          >
            Reject
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default RejectModal;
