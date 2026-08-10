import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useIdentity from '@/hooks/useIdentity';

import Icon from '../../Icon';
import RowWrapper from '../../RowWrapper';
import TextStyle from '../../TextStyle';

import useGetBucketDebtorDetail from './hooks/useGetBucketDebtorDetail';

import type { AlertDifferentDataProps } from './AlertDifferentData.type';


const AlertDifferentData = ({
  bucketProcessId,
  module,
  process,
  refetchInterval = false,
  isReviewer = false,
}: AlertDifferentDataProps) => {
  const { parentId } = useIdentity();

  const { data: changed } = useGetBucketDebtorDetail({
    bucketProcessId,
    module,
    process,
  }, {
    notifyOnChangeProps: ['data'],
    refetchInterval,
    refetchIntervalInBackground: false,
    select: (res) => Boolean(res?.isMasterCustomerChange),
  });

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(parentId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  }, {
    enabled: isReviewer,
    notifyOnChangeProps: ['data'],
    refetchInterval: isReviewer ? refetchInterval : false,
    refetchIntervalInBackground: false,
  });

  const shouldShowAlert = isReviewer
    ? Boolean(debtorInfoData?.isChangeMIPR)
    : Boolean(changed);

  if (!shouldShowAlert) return null;

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
        {isReviewer ? 'Data bisnis telah mengalami perubahan. Mohon melakukan pengecekan dokumen terupdate.' : 'Data Customer telah mengalami perubahan.'}
      </TextStyle>
    </RowWrapper>
  );
};

export default AlertDifferentData;
