import { useTheme } from '@mui/material';

import { TypeModule } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';


const useViewAllDocument = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const { typeProcess } = useAnnualReviewContext();
  const [appState] = useApp();
  const isKadiv = appState.currentRole.includes('KADIV');
  const isTL = appState.currentRole.includes('TL');
  const isRM = appState.currentRole.includes('STAFF');

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  return {
    isKadiv,
    isPemda,
    isRM,
    isTL,
    theme,
    typeProcess,
  };
};

export default useViewAllDocument;
