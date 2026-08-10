import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type {
  BaseResponseGenericBucketResponseDtoListFinancingFacilityAnnualReviewResponseDto,
  GenericBucketRequestDtoRequestByProcessIdDtoString,
  GenericBucketResponseDtoListFinancingFacilityAnnualReviewResponseDto,
} from '../FinancingFacility.type';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetFinancingFacilityExistingList = (
  payload: GenericBucketRequestDtoRequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<GenericBucketResponseDtoListFinancingFacilityAnnualReviewResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.financingFacilityAnnualReview.list', {
        data: payload,
      });

      return res.data;
    },
    queryKey: [
      'financingFacilitiesExisting',
      payload
    ],
    select: (res: BaseResponseGenericBucketResponseDtoListFinancingFacilityAnnualReviewResponseDto) => res.data,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityExistingList;
