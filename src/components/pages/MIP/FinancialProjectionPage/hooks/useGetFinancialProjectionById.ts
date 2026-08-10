import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancialProjectionControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new FinancialProjectionControllerApi();

const useGetFinancialProjectionById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: Object.entries(payload).every((value) => !!value),
    queryFn: async () => {
      const res = await api.getDetailFinancialProjection(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-financial-projection', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetFinancialProjectionById;
