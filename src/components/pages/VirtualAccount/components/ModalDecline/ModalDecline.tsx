import React, { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../ListPage/List.constants';


import type { ModalCommentProps } from './ModalDecline.types';


const ModalComment = NiceModal.create(({
  title = 'Comment',
  viewOnly,
  onCancel,
  onReject,
  initialComment,
  isLoading,
}: ModalCommentProps) => {
  const theme = useTheme();
  const [value, setValue] = useState(initialComment || '');

  const modals = useModal();
  const modalId = modal.DECLINE;

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modals.visible}
      onClose={() => closeNiceModal(modalId)}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          maxHeight: '60vh',
          maxWidth: '73vw',
          minWidth: '60vw',
          padding: theme.spacing(4),
        },
      }}
    >
      <RowWrapper
        sx={{
          borderBottom: 1,
          borderColor: theme.palette.custom.gray30,
          borderWidth: '0.02vw',
          justifyContent: 'center',
          marginBottom: theme.spacing(4),
        }}
      >
        <TextStyle
          variant="body1"
          weight={600}
          color={theme.palette.primary.main}
          sx={{
            py: 2,
          }}
        >
          {title}
        </TextStyle>
      </RowWrapper>


      <Input
        type="area"
        placeholder="Comment"
        rows={6}
        multiline
        value={value}
        onChange={(val) => setValue(val)}
        {...(viewOnly && { disabled: true })}
      />
      {viewOnly ? (
        <RowWrapper sx={{ justifyContent: 'end', mt: 4 }}>
          <>
            <Button
              variant="outlined"
              onClick={() => closeNiceModal(modalId)}
              sx={{ height: '3vw', width: '8vw' }}
            >
              Close
            </Button>
          </>
        </RowWrapper>
      ) : (
        <RowWrapper sx={{ justifyContent: 'end', mt: 4 }}>
          <>
            <Button
              variant="outlined"
              onClick={() => closeNiceModal(modalId)}
              sx={{ height: '3vw', mr: 3, width: '8vw' }}
            >
              Close
            </Button>
            <Button
              onClick={() => onCancel({
                comment: value,
              })}
              sx={{ height: '3vw', mr: 3, width: '8vw' }}
              disabled={!value}
              isLoading={isLoading}
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onReject({
                comment: value,
              })}
              sx={{ height: '3vw', width: '8vw' }}
              disabled={!value}
              isLoading={isLoading}
              color="error"
            >
              Reject
            </Button>
          </>
        </RowWrapper>
      )}
    </Dialog>
  );


});
export default ModalComment;
