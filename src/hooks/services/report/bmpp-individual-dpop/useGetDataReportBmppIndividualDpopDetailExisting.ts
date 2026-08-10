import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportBmppIndividualDpopDetailExisting = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await API('report.bmppIndividualDpop.detailExisting', { data: payload });
      return response.data.data;
    },
    queryKey: ['report-bmpp-individual-dpop-detail-existing', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportBmppIndividualDpopDetailExisting;
