import { useEffect } from 'react';

import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useCreditChecking from '@/components/layouts/CreditCheckingLayout/CreditChecking.hook';


const useViewAllDocument = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const { process } = useCreditChecking();
  const { recordActivity } = useRecordLog();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.CREDIT_CHECKING,
    process: TypeProcess.CREDIT_CHECKING,
  });

  useEffect(() => {
    if (debtorInfoData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.CREDIT_CHECKING,
        process: TypeProcess.CREDIT_CHECKING,
        remarks: 'view credit checking view all document page',
      });
    }
  });


  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);
  return {
    isPemda,
    process,
    theme,
  };
};

export default useViewAllDocument;
