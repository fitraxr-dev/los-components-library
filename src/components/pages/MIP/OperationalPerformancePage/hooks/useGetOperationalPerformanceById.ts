import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { OperationalPerformanceControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new OperationalPerformanceControllerApi();

const useGetOperationalPerformanceById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailOperationalPerformance(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-operational-performance', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetOperationalPerformanceById;
