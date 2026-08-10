import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';


const useViewAllDocument = () => {
  const { processId, parentId } = useIdentity();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: `${TypeProcess.REVIEWER_DH}|${TypeProcess.MIP_REVIEW}`,
  });


  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  return {
    isPemda,
    parentId,
    processId,
  };
};

export default useViewAllDocument;
