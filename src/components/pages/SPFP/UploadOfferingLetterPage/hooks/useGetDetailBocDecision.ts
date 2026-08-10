import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { BocDecisionControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/agreement-service';


const api = new BocDecisionControllerApi() ;

const useGetDetailBocDecision = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailBocDecisions(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['upload-offering-letter', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailBocDecision;
