import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type {
  BaseResponseGenericBucketResponseDtoSelectedVisitResponseDto,
  GenericBucketRequestDtoVisitRequestDto,
} from '@/services/openapi/site-visit-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new VisitControllerApi();

const useGetSiteVisitSelectedList = (
  payload: GenericBucketRequestDtoVisitRequestDto,
  config?: Partial<UseQueryOptions<BaseResponseGenericBucketResponseDtoSelectedVisitResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.getListSelectedVisit(payload);

      return response.data;
    },
    queryKey: ['site-visit-selected-list', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetSiteVisitSelectedList;
