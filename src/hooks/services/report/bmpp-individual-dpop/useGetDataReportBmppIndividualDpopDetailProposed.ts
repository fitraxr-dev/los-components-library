import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportBmppIndividualDpopDetailProposed = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await API('report.bmppIndividualDpop.detailProposed', { data: payload });
      return response.data.data;
    },
    queryKey: ['report-bmpp-individual-dpop-detail-proposed', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportBmppIndividualDpopDetailProposed;
