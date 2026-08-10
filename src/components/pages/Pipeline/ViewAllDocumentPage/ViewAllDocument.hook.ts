import { useEffect } from 'react';

import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';


const useViewAllDocument = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.PIPELINE,
    process: TypeProcess.PIPELINE,
  });

  // Record activity when viewing all documents page
  useEffect(() => {
    if (debtorInfoData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view all documents page in pipeline',
      });
    }
  }, [debtorInfoData, processId, recordActivity]);

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  return {
    isPemda,
    theme,
  };
};

export default useViewAllDocument;
