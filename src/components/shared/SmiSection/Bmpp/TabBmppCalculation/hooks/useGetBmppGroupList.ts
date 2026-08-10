import { useQuery } from '@tanstack/react-query';

import { BmppControllerApi } from '@/services/openapi/mip-service';

import type { BmppGroupsComponentResponseDto, BmppGroupsRequestDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BmppControllerApi();

const useGetBmppGroupList = (
  payload: BmppGroupsRequestDto,
  config?: Partial<UseQueryOptions<Array<BmppGroupsComponentResponseDto>>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getBmppGroup(payload);

      return res.data?.data?.contents;
    },
    queryKey: ['bmpp-groups', payload],
    ...config,
  });

  return query;
};

export default useGetBmppGroupList;
