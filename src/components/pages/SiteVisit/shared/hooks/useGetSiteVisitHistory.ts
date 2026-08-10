import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type {
  BaseResponseGenericBucketResponseDtoHistoryVisitResponseDto,
  GenericBucketRequestDtoVisitRequestDto,
} from '@/services/openapi/site-visit-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new VisitControllerApi();

const useGetSiteVisitHistory = (
  payload: GenericBucketRequestDtoVisitRequestDto,
  config?: Partial<UseQueryOptions<BaseResponseGenericBucketResponseDtoHistoryVisitResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.getHistoryVisit(payload);

      return response.data;
    },
    queryKey: ['site-visit-history', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetSiteVisitHistory;
