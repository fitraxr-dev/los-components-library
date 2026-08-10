import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useGetCurrentModule from '../hooks/useGetCurrentModule';


const useViewAllDocument = () => {
  const { module, process } = useGetCurrentModule();
  const { processId, debtorId, setDebtorId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: module,
    process: process,
  });

  useEffect(() => {
    if (debtorInfoData?.debtorId !== debtorId) {
      setDebtorId(debtorInfoData.debtorId);
    }
  }, [debtorInfoData?.debtorId, debtorId]);

  // Record activity when view all document page is loaded
  useEffect(() => {
    if (debtorInfoData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view all documents page in lpa review',
      });
    }
  }, [debtorInfoData, processId, module, process, recordActivity]);

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  return {
    isPemda,
    module,
    process,
  };
};
export default useViewAllDocument;
