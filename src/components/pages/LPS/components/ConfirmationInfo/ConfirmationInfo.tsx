import React from 'react';

import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


interface ConfirmationInfoProps {
  notice?: string;
}

const ConfirmationInfo = ({ notice }: ConfirmationInfoProps) => {
  const warningMessage = notice || 'Nominal tidak sesuai';

  return (
    <RowWrapper
      justifyContent="space-between"
      alignItems="center"
      mb={2}
      sx={{ backgroundColor: '#fffce4', border: 'solid 1px #f2c009', borderRadius: 1, padding: 2 }}
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
