import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProfileControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new ProfileControllerApi();

const useGetProfileById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailProfile(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mup-profile', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetProfileById;
