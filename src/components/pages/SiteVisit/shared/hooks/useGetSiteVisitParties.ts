import { useQuery } from '@tanstack/react-query';

import { SiteVisitControllerApi } from '@/services/openapi/site-visit-service';

import type { PartyRequestDto } from '@/services/openapi/site-visit-service';


const api = new SiteVisitControllerApi();

const useGetSiteVisitParties = (
  payload: PartyRequestDto | null,
  isEnable: boolean
) => {
  const query = useQuery({
    enabled: isEnable,
    queryFn: async () => {
      const response = await api.getParties(payload);

      return response.data.data.content;
    },
    queryKey: ['site-visit-parties', payload?.bucketProcessId, payload?.id, payload?.party],
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useGetSiteVisitParties;
