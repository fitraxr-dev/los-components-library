'use client';

import { TypeProcess } from '@/enums/Module';

import Icon from '../../Icon';
import RowWrapper from '../../RowWrapper';
import TextStyle from '../../TextStyle';

import useCheckRisalahRapatExpired from './hooks/useCheckRisalahRapatExpired';

import type { AlertRisalahRapatProps } from './AlertRisalahRapat.type';


const AlertRisalahRapat = ({
  bucketProcessId,
  module,
  process,
  refetchInterval = false,
}: AlertRisalahRapatProps) => {
  const { data } = useCheckRisalahRapatExpired(
    {
      bucketProcessId,
      module,
      process,
    },
    {
      notifyOnChangeProps: ['data'],
      refetchInterval,
      refetchIntervalInBackground: false,
      select: (res) => res,
    }
  );

  if (!data?.message) return null;

  if (process === TypeProcess.ENGAGEMENT_AGREEMENT) {
    if (data?.isExpired) {
      localStorage.setItem('statusRR', 'expired');
    }
  }

  return (
    <RowWrapper
      alignItems="center"
      width="100%"
      mb={2}
      sx={{ backgroundColor: '#fffce4', gap: 2, padding: 2 }}
    >
      <Icon
        textVariant="body1"
        iconName="warning-2"
      />
      <TextStyle>
        {data.message}
      </TextStyle>
    </RowWrapper>
  );
};

export default AlertRisalahRapat;
