import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const useGetDetailFinancingOverview = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: Object.values(payload).every((value) => !!value),
    queryFn: async () => {
      const res = await API('mip.financingFacility.detail', {
        data: payload,
      });

      return res?.data?.data?.content;
    },
    queryKey: ['financing-overview', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailFinancingOverview;
