import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { SummaryControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new SummaryControllerApi();

const useGetSummary = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailSummary(payload);

      return res.data;
    },
    queryKey: ['get-summary', {
      ...payload,
    }],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetSummary;
