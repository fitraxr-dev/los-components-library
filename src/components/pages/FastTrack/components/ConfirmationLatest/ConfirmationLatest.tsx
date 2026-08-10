import React from 'react';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useConfirmationLatest from './ConfirmationLatest.hook';


const ConfirmationLatest = () => {
  const {
    isShowConfirm,
    handleConfirmHistory,
    isSaveLoading,
  } = useConfirmationLatest();
  return (
    <>
      {isShowConfirm &&
      <RowWrapper
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{ backgroundColor: '#fffce4', padding: 2 }}
      >
        <RowWrapper gap={1}>
          <Icon
            textVariant="body1"
            iconName="warning-2"
          />
          <TextStyle>
            Data bisnis telah mengalami perubahan. Apakah Anda ingin mengambil perubahan terbaru? Mohon konfirmasi.
          </TextStyle>
        </RowWrapper>
        <RowWrapper gap={1}>
          <Button
            variant="outlined"
            sx={{ padding: 1 }}
            onClick={handleConfirmHistory.bind(null, false)}
            isLoading={isSaveLoading}
          >
            Tidak
          </Button>
          <Button
            sx={{ padding: 1 }}
            onClick={handleConfirmHistory.bind(null, true)}
            isLoading={isSaveLoading}
          >
            Ya
          </Button>
        </RowWrapper>
      </RowWrapper>
      }
    </>

  );
};

export default ConfirmationLatest;
