import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FinancialEconomicIndicatorControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new FinancialEconomicIndicatorControllerApi();

const useGetFinancialEconomy = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailFinancialEconomicIndicator(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-financial-economy', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetFinancialEconomy;
