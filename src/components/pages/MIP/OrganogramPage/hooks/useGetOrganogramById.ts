import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { OrganogramControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new OrganogramControllerApi();

const useGetOrganogramById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailOrganogram(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['organogram', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetOrganogramById;
