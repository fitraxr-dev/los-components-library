import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ConcernControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new ConcernControllerApi();

const useGetDetailConcern = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailConcern(payload);

      return res.data.data?.content;
    },
    queryKey: ['concern-detail', payload],
    staleTime: ONE_MINUTE,
  });
  return query;
};

export default useGetDetailConcern;
