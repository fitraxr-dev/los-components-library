import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportBmppIndividualBisnisDetailProposed = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling Detail Proposed API with payload:', payload);
        const response = await API('report.bmppIndividualBisnis.detailProposed', { data: payload });
        console.log('Detail Proposed API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('Detail Proposed API error:', error);
        throw error;
      }
    },
    queryKey: ['report-bmpp-individual-bisnis-detail-proposed', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportBmppIndividualBisnisDetailProposed;
