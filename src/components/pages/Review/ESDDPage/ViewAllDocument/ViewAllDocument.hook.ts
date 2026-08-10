import { useEffect } from 'react';


import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useESDDAccess } from '../hooks/useESDDAccess';


const useViewAllDocument = () => {
  const { processId, parentId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: `${TypeProcess.REVIEWER_DELST}|${TypeProcess.MIP_REVIEW}`,
  });


  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  useEffect(() => {
    if (processId) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: String(processId),
        changeAfter: JSON.stringify({ parentId, processId }),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'view all document page',
      });
    }
  }, [processId, parentId, recordActivity]);

  return {
    isPemda,
    parentId,
    processId,
  };
};

export default useViewAllDocument;
