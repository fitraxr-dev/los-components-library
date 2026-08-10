import { useQuery } from '@tanstack/react-query';

import { MaintenanceOtherRelatedPartiesControllerApi } from '@/services/openapi/master-service';

import type {
  DetailOtherRelatedPartiesRequestDto,
  DetailOtherRelatedPartiesResponseDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceOtherRelatedPartiesControllerApi();

const useGetOtherRelatedById = (
  payload: DetailOtherRelatedPartiesRequestDto,
  config?: Partial<UseQueryOptions<DetailOtherRelatedPartiesResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailMaintenanceOtherRelatedParties(payload);

      return res.data.data.content;
    },
    queryKey: ['other-related-by-id', payload.partyId],
    ...config,
  });
  return query;
};

export default useGetOtherRelatedById;
