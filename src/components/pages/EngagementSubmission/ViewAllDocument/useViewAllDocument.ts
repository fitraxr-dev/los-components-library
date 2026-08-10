import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketChildList from '@/hooks/services/useGetBucketChildList';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useGetListProcessingType from './hooks/useGetListProcessingType';


const useViewAllDocument = () => {
  const { processId } = useIdentity();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.ENGAGEMENT_AGREEMENT,
  });

  const isPemda = Object.values<string>(DebtorNamesetResponseDtoRegionalGovernEnum).includes(debtorInfoData?.institutionType || '');

  const { data, isSuccess } = useGetListProcessingType(
    {
      bucketProcessId: processId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
    }
  );
  const rippleToDocument = isSuccess && data.contents?.length &&
      data.contents?.map((res) => ({
        bucketProcessId: res.bucketProcessId,
        module: TypeModule.ENGAGEMENT_AGREEMENT,
        process: TypeProcess.PROCESSING_TYPE_PK,
      })) || [];
  return {
    isPemda,
    rippleToDocument,
  };
};

export default useViewAllDocument;
