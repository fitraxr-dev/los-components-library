import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type {
  BaseResponseGenericSingleDtoFinancingFacilityAnnualReviewResponseDto,
  FinancingFacilityResponseDto,
  RequestByIdDtoLong,
} from '../FinancingFacility.type';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetFinancingFacilityExistingById = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<FinancingFacilityResponseDto>({
    queryFn: async () => {
      const res = await API('bucket.financingFacilityAnnualReview.detail', {
        data: payload,
      });

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
