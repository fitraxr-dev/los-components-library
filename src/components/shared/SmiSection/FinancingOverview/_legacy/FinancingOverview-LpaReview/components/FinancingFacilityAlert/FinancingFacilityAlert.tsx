import React from 'react';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useFinancingFacilityAlert from './FinancingFacilityAlert.hook';


const FinancingFacilityAlert = () => {
  const {
    isShowAlert,
    handleApplyDiff,
    isSaveLoading,
  } = useFinancingFacilityAlert();
  return (
    <>
      {isShowAlert &&
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
            Data fasilitas pembiayaan telah mengalami perubahan. Apakah
            Anda ingin mengambil perubahan terbaru? Mohon konfirmasi.
          </TextStyle>
        </RowWrapper>
        <RowWrapper gap={1}>
          <Button
            sx={{ padding: 1 }}
            onClick={handleApplyDiff}
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

export default FinancingFacilityAlert;
