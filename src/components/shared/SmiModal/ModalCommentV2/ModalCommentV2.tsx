import React, { useState } from 'react';

import { Dialog, useTheme } from '@mui/material';

import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import ModalTransition from '../ModalTransition';


const ModalCommentV2 = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const [value, setValue] = useState('');
  const [showModal, setShowModal] = useState(true);

  function onSave() {
    alert(1);
    alert(value);
  }

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={showModal}
      onClose={() => setShowModal(false)}
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
          Comment
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
              onClick={() => setShowModal(false)}
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
              onClick={() => setShowModal(false)}
              sx={{ height: '3vw', mr: 3, width: '8vw' }}
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              sx={{ height: '3vw', width: '8vw' }}
            >
              Save
            </Button>
          </>
        </RowWrapper>
      )}
    </Dialog>
  );
};


export default ModalCommentV2;
