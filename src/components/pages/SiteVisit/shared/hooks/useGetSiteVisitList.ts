import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { SiteVisitControllerApi } from '@/services/openapi/site-visit-service';

import type {
  BaseResponseGenericSingleDtoListListSiteVisitResponseDto,
  ListSiteVisitResponseDto,
  RequestDto,
} from '@/services/openapi/site-visit-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new SiteVisitControllerApi();

const useGetSiteVisitList = (
  payload: RequestDto,
  config?: Partial<UseQueryOptions<ListSiteVisitResponseDto[]>>
) => {
  const query = useQuery({
    gcTime: ONE_MINUTE,
    queryFn: async () => {
      const response = await api.getListSiteVisit(payload);

      return response.data.data.content;
    },
    queryKey: ['site-visit-list', payload?.bucketProcessId],
    ...config,
  });

  return query;
};

export default useGetSiteVisitList;
