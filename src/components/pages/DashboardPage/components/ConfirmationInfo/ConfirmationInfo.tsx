import React from 'react';

import useIdentity from '@/hooks/useIdentity';

import BaseContainer from '@/components/shared/BaseContainer';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useGetInformationReassign from '../../hooks/useGetInformationReassign';


const ConfirmationInfo = () => {
  const { userData } = useIdentity();
  const userId = userData?.user?.userId;
  const { data: reassignInfo, isError } = useGetInformationReassign({
    originPicId: userId,
  });

  if (isError || !reassignInfo?.isOnSku) {
    return null;
  }

  return (
    <BaseContainer>
      <RowWrapper
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: '#fffce4', border: 'solid 1px #f2c009', borderRadius: 1, padding: 2 }}
      >
        <RowWrapper gap={1}>
          <Icon textVariant="body1" iconName="warning-2" />
          <TextStyle>
            Akun Anda Sedang Direassign ke Akun{' '}
            <TextStyle weight={600}>{reassignInfo?.name} - {reassignInfo?.division}</TextStyle>
          </TextStyle>
        </RowWrapper>
      </RowWrapper>
    </BaseContainer>
  );
};

export default ConfirmationInfo;
