import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FeasibilityAspectControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new FeasibilityAspectControllerApi();

const useGetFeasibilityAspectById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailFeasibilityAspect(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mup-feasibility-aspect', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetFeasibilityAspectById;
