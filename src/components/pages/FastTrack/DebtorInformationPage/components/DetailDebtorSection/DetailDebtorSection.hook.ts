import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useFastTrackContext } from '@/components/layouts/FastTrackLayout/FastTrack.context';


const useDetailDebtorSection = () => {
  const { processId } = useIdentity();
  const { isDpop, isRequestModule } = useFastTrackContext();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.FAST_TRACK,
    process: TypeProcess.FAST_TRACK,
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
