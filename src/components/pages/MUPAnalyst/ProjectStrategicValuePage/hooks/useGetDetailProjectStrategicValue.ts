import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProjectStrategicValueControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new ProjectStrategicValueControllerApi() ;

const useGetDetailProjectStrategicValue = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailProjectStrategicValue(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['project-strategic-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailProjectStrategicValue;
