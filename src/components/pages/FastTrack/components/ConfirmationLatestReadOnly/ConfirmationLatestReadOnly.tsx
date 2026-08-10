// ConfirmationLatestReadOnly.tsx

import React from 'react';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useConfirmationLatestReadOnly from './ConfirmationLatestReadOnly.hook';


const ConfirmationLatestReadOnly = () => {
  const {
    isShowConfirm,
    handleClose,
  } = useConfirmationLatestReadOnly ();

  return (
    <>
      {isShowConfirm &&
      <RowWrapper
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{ backgroundColor: '#fffce4', pb: 2, pl: 2, pt: 2 }}
      >
        <RowWrapper gap={1}>
          <Icon
            textVariant="body1"
            iconName="warning-2"
          />
          <TextStyle>
            Data bisnis telah mengalami perubahan.
          </TextStyle>
        </RowWrapper>
        <RowWrapper gap={1}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{

              '&:active': {
                backgroundColor: 'transparent',
              },


              '&:focus': {
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                outline: 'none',
              },

              '&:hover': {
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
              },
              border: 'none',
              minWidth: 'auto',
              px: 2,
              py: 0.5,
            }}
          >
            <Icon iconName="close" />
          </Button>
        </RowWrapper>
      </RowWrapper>
      }
    </>
  );
};

export default ConfirmationLatestReadOnly;
