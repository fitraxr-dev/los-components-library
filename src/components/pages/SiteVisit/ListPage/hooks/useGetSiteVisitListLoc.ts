import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type {
  GenericBucketRequestDtoVisitRequestDto,
  BaseResponseGenericBucketResponseDtoVisitResponseDto,
} from '@/services/openapi/site-visit-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new VisitControllerApi();


const useGetSiteVisitLoc = (
  payload: GenericBucketRequestDtoVisitRequestDto,
  config?: Partial<UseQueryOptions<BaseResponseGenericBucketResponseDtoVisitResponseDto>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getVisitLocations(payload);
        return res.data;
      },
      queryKey: [
        'site-visit-list',
        payload
      ],
      ...config,
    }
  );

  return query;
};


export default useGetSiteVisitLoc;
