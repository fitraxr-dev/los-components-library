import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();


const useGetBmppDetailMaster = (payload: RequestByProcessIdDtoString, isEnable?: boolean) => {
  const query = useQuery({
    enabled: isEnable,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBmppDetail(payload);

      return res.data?.data?.content;
    },
    queryKey: ['master-bmpp-calculation-detail', payload],
  });

  return query;
};

export default useGetBmppDetailMaster;
