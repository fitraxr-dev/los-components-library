import { useQuery } from '@tanstack/react-query';

import { ConclusionControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new ConclusionControllerApi();

const useGetDetailConclusion = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailConclusion(payload);

      return res.data.data.content;
    },
    queryKey: ['conclusion', payload],
  });

  return query;
};

export default useGetDetailConclusion;
