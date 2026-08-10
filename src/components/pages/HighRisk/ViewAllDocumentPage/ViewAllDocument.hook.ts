import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';


const useViewAllDocument = () => {
  const theme = useTheme();
  const { processId } = useIdentity();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  return {
    isPemda,
    theme,
  };
};

export default useViewAllDocument;
