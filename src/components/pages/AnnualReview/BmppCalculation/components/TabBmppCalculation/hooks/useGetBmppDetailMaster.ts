import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByProcessIdDtoString } from '../TabBmppCalculation.types';


const useGetBmppDetailMaster = (payload: RequestByProcessIdDtoString, isEnable?: boolean) => {
  const query = useQuery({
    enabled: isEnable,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.bmpp.simulationDetail', {
        data: payload,
      });

      return res.data?.data?.content;
    },
    queryKey: ['master-bmpp-calculation-detail', payload],
  });

  return query;
};

export default useGetBmppDetailMaster;
