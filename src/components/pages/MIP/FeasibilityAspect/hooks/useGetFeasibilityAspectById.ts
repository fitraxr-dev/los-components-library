import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FeasibilityAspectControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new FeasibilityAspectControllerApi();

const useGetFeasibilityAspectById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: Object.entries(payload).every((value) => !!value),
    queryFn: async () => {
      const res = await api.getDetailFeasibilityAspect(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-feasibility-aspect', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetFeasibilityAspectById;
