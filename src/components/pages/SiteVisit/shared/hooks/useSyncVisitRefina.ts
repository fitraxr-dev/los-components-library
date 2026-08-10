import { useQuery } from '@tanstack/react-query';

import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type { BaseRequestDto } from '@/services/openapi/site-visit-service';


const api = new VisitControllerApi();

const useSyncVisitRefina = (
  payload: BaseRequestDto,
  isEnable?: boolean
) => {
  const query = useQuery({
    enabled: isEnable,
    queryFn: async () => {
      const response = await api.syncSiteVisitRefina(payload);

      return response.data.data.content;
    },
    queryKey: ['site-visit-sync-refina', payload],
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useSyncVisitRefina;
