import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoString } from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();

const useGetExchangeRateExisting = (
  payload: RequestByIdDtoString
) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getExistingExchangeRate(payload);

      return res.data?.data?.content;
    },
    queryKey: ['existing-exchange-rate', payload],
  });
};

export default useGetExchangeRateExisting;
