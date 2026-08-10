import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useCheckRisalahRapatExpired from './hooks/useCheckRisalahRapatExpired';

import type { AlertRisalahRapatExpiredProps } from './AlertRisalahRapatExpired.type';


const AlertRisalahRapatExpired = ({
  bucketProcessId,
  module,
  process,
  refetchInterval = false,
}: AlertRisalahRapatExpiredProps) => {
  const { data } = useCheckRisalahRapatExpired({
    bucketProcessId,
    module,
    process,
  }, {
    notifyOnChangeProps: ['data'],
    refetchInterval,
    refetchIntervalInBackground: false,
  });

  if (!data?.isExpired && !data?.message) return null;

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
        {data?.message || 'Risalah Rapat telah expired.'}
      </TextStyle>
    </RowWrapper>
  );
};

export default AlertRisalahRapatExpired;
