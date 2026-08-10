'use client';

import Icon from '../../Icon';
import RowWrapper from '../../RowWrapper';
import TextStyle from '../../TextStyle';

import useCheckDocumentUpdates from './hooks/useCheckDocumentUpdates';

import type { AlertDocumentUpdatesProps } from './AlertDocumentUpdates.type';


const AlertDocumentUpdates = ({
  document,
  applicationCategory,
  module,
  process,
  message,
  refetchInterval = false,
}: AlertDocumentUpdatesProps) => {
  const { data: changed } = useCheckDocumentUpdates({
    applicationCategory,
    document,
    module,
    process,
  }, {
    notifyOnChangeProps: ['data'],
    refetchInterval,
    refetchIntervalInBackground: false,
    select: (res) => Boolean(res?.isMasterCustomerChange),
  });

  if (!changed) return null;

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
        {message}
      </TextStyle>
    </RowWrapper>
  );
};

export default AlertDocumentUpdates;
