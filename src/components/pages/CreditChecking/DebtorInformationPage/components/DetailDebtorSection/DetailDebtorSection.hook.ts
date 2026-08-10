import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';


const useDetailDebtorSection = () => {
  const { processId } = useIdentity();
  const { isDpop, isRequestModule } = useCreditCheckingContext();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.CREDIT_CHECKING,
    process: isDpop ?
      (isRequestModule ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP) :
      TypeProcess.CREDIT_CHECKING,
  });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);

  return {
    debtorInfoData,
    isPemda,
    jobPositionData,
  };
};

export default useDetailDebtorSection;
