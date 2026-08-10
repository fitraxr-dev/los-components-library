import React from 'react';

import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


const ConfirmationInfo = () => {
  const warningMessage = 'Pastikan Anda telah mengunggah dokumen yang diperlukan, seperti surat permohonan pengecekan dari customer, akta pendirian, akta perubahan, susunan pengurus, susunan pemegang saham, NPWP, kartu identitas, dan dokumen lainnya yang diperlukan';

  return (
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
          {warningMessage}
        </TextStyle>
      </RowWrapper>
    </RowWrapper>
  );
};

export default ConfirmationInfo;
