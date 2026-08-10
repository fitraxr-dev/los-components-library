import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SummaryControllerApi } from '@/services/openapi/credit-checking-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/credit-checking-service';


const api = new SummaryControllerApi();

const useGetSummary = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailSummary(payload);

      return res.data;
    },
    queryKey: ['get-summary', payload],
    select: (data) => data.data,
  });

  return query;
};

export default useGetSummary;
