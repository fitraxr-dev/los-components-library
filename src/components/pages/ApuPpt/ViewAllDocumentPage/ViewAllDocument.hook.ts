import { useTheme } from '@mui/material';

import { TypeModule } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';


const useViewAllDocument = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const { process } = useApuPpt();
  const [{ stepper }] = useApp();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });

  const isDeletable = stepper.steps.find((step) => step.key === 'view-all-document')?.enable;

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);
  return {
    isDeletable,
    isPemda,
    process,
    theme,
  };
};

export default useViewAllDocument;
