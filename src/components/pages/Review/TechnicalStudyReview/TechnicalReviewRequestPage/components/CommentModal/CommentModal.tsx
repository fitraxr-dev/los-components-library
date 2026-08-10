import React, { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionModal from '@/components/shared/Modal/SectionModal';
import RowWrapper from '@/components/shared/RowWrapper';

import { modal } from '../../TechnicalReviewRequest.constants';


const CommentModal = NiceModal.create(() => {
  const theme = useTheme();
  const modalId = modal.SUBMIT;
  const { visible } = useModal(modalId);

  const [value, setValue] = useState('');

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
          type="area"
          placeholder="Comment"
          rows={6}
          multiline
          value={value}
          onChange={(val) => setValue(val)}
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
            onClick={() => {console.log(value); closeNiceModal(modalId);}}
            disabled={!value}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default CommentModal;
