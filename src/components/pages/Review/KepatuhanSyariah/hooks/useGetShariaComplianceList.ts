import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ShariaComplianceChecklistControllerApi } from '@/services/openapi/mip-service';

import type {
  ListShariaComplianceChecklistResponseDto,
  RequestByProcessIdDtoString,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ShariaComplianceChecklistControllerApi();

const useGetShariaComplianceList = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<ListShariaComplianceChecklistResponseDto[]>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListShariaComplianceChecklist(payload);

      return res.data.data.contents;
    },
    queryKey: ['sharia-compliance-list', { id: payload.bucketProcessId }],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetShariaComplianceList;
