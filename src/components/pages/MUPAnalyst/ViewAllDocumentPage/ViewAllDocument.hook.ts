import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useMUPAnalystAccess } from '../hooks/useMUPAnalystAccess';


const useViewAllDocument = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { baseMUPAnalystAccess } = useMUPAnalystAccess();
  const { canView } = baseMUPAnalystAccess;

  useEffect(() => {
    if (canView) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MUP,
        process: TypeProcess.MUP_ANALYST,
        remarks: 'View All Document page accessed',
      });
    }
  }, [canView, processId, recordActivity]);

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP_ANALYST,
  });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  const handleDownload = (docId: number, fileName: string) => {
    recordActivity({
      activity: ActivityType.DOWNLOAD,
      bucketProcessId: processId,
      module: TypeModule.MUP,
      process: TypeProcess.MUP_ANALYST,
      remarks: `Download document ${fileName || docId}`,
    });
  };

  return {
    canView,
    handleDownload,
    isPemda,
  };
};

export default useViewAllDocument;
