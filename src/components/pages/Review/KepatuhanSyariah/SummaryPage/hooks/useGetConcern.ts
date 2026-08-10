import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ConcernControllerApi } from '@/services/openapi/mip-service';

import type { ListConcernRequestDto } from '@/services/openapi/mip-service';


const api = new ConcernControllerApi();

const useGetConcern = (payload: ListConcernRequestDto) => {
  const query = useQuery({
    initialData: [],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListConcern(payload);

      return res.data.data.contents;
    },
    queryKey: ['concern-summary', {
      ...payload,
    }],
  });

  return query;
};

export default useGetConcern;
