import { useQuery } from '@tanstack/react-query';

import { SiteVisitControllerApi } from '@/services/openapi/site-visit-service';

import type { RequestDto } from '@/services/openapi/site-visit-service';


const api = new SiteVisitControllerApi();

const useGetSiteVisitInformation = (
  payload: RequestDto | null,
  isEnable: boolean
) => {
  const query = useQuery({
    enabled: isEnable,
    queryFn: async () => {
      const response = await api.getSiteVisitInformation(payload);

      return response.data.data.content;
    },
    queryKey: ['site-visit-information', payload?.bucketProcessId, payload?.id],
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useGetSiteVisitInformation;
