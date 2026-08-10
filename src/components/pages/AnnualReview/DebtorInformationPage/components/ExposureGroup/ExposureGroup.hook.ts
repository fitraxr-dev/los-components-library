import { TypeModule } from '@/enums/Module';
import useGetExposureGroup from '@/hooks/services/bucket/debtor/useGetExposureGroup';
import useIdentity from '@/hooks/useIdentity';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';


const useExposureGroup = () => {
  const { processId } = useIdentity();
  const { typeProcess } = useAnnualReviewContext();

  const { data: exposureGroupData } = useGetExposureGroup({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  return {
    exposureGroupData,
  };
};

export default useExposureGroup;
