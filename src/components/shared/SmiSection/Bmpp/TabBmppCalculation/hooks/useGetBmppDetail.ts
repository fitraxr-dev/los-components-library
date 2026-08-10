import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BmppControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new BmppControllerApi();


const useGetBmppDetail = (payload: RequestByProcessIdDtoString, isEnable?: boolean) => {
  const query = useQuery({
    enabled: isEnable,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBmppDetail(payload);

      return res.data?.data?.content;
    },
    queryKey: ['bmpp-calculation-detail', payload],
  });

  return query;
};

export default useGetBmppDetail;
