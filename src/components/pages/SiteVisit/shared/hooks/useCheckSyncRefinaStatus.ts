import { useQuery } from '@tanstack/react-query';

import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type { BaseRequestDto } from '@/services/openapi/site-visit-service';


const api = new VisitControllerApi();

const useCheckSyncRefinaStatus = (
  payload: BaseRequestDto,
  isEnable?: boolean
) => {
  const query = useQuery({
    enabled: isEnable,
    queryFn: async () => {
      const response = await api.checkSyncStatus(payload);

      return response.data.data.content;
    },
    queryKey: ['site-visit-sync-refina-status', payload],
    // Add polling when sync is in progress
    refetchInterval: (data) => {
      // If status is not complete, poll every 2 seconds
      if (data?.status?.toLowerCase() !== 'completed' && data?.status?.toLowerCase() !== 'failed') {
        return 2000;
      }
      return false; // Stop polling when complete
    },

    refetchOnWindowFocus: false,
  });

  return query;
};

export default useCheckSyncRefinaStatus;
