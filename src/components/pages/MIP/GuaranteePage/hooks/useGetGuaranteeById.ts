import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { GuaranteeControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new GuaranteeControllerApi();

const useGetGuaranteeById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailGuarantee(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-guarantee', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetGuaranteeById;
