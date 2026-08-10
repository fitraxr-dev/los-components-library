import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ConcernControllerApi } from '@/services/openapi/mip-service';

import type { ListConcernRequestDto } from '@/services/openapi/mip-service';


const api = new ConcernControllerApi();

const useGetConcernList = (payload: ListConcernRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListConcern(payload);

      return res.data.data?.contents;
    },
    queryKey: ['concern-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetConcernList;
