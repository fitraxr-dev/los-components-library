import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type {
  RequestByIdDtoLong,
  BaseResponseGenericSingleDtoFinancingFacilityAnnualReviewResponseDto,
  FinancingFacilityResponseDto,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetFinancingFacilityExistingById = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<FinancingFacilityResponseDto>({
    queryFn: async () => {
      const res = await api.getDetailFinancingFacilityAnnualReview(payload);

      return res.data;
    },
    queryKey: [
      'financingFacilityExisting',
      { id: payload?.id }
    ],
    select: (res: BaseResponseGenericSingleDtoFinancingFacilityAnnualReviewResponseDto) => res.data?.content,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityExistingById;
