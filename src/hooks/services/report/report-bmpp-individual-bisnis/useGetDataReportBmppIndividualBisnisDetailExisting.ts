import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportBmppIndividualBisnisDetailExisting = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling Detail Existing API with payload:', payload);
        const response = await API('report.bmppIndividualBisnis.detailExisting', { data: payload });
        console.log('Detail Existing API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('Detail Existing API error:', error);
        throw error;
      }
    },
    queryKey: ['report-bmpp-individual-bisnis-detail-existing', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportBmppIndividualBisnisDetailExisting;
