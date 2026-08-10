import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';


const useViewAllDocument = () => {
  const theme = useTheme();
  const [state] = useApp();
  const { processId } = useIdentity();
  const [appState] = useApp();
  const isKadiv = appState.currentRole.includes('KADIV');
  const isTL = appState.currentRole.includes('TL');
  const isRM = appState.currentRole.includes('STAFF');

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: appState.pages?.mipModule,
    process: appState.pages?.mipProcess,
  });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  return {
    bucketMasterId: debtorInfoData?.bucketMasterId,
    isKadiv,
    isPemda,
    isRM,
    isTL,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    theme,
  };
};

export default useViewAllDocument;
