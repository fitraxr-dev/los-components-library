import { useQuery } from '@tanstack/react-query';

import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type { BmppGroupsComponentResponseDto, BmppGroupsRequestDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new SimulationBmppControllerApi();

const useGetBmppGroupListMaster = (
  payload: BmppGroupsRequestDto,
  config?: Partial<UseQueryOptions<Array<BmppGroupsComponentResponseDto>>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getBmppGroup(payload);

      return res.data?.data?.contents;
    },
    queryKey: ['master-bmpp-groups', payload],
    ...config,
  });

  return query;
};

export default useGetBmppGroupListMaster;
