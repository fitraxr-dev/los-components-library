import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportBmppIndividualBisnisDetail = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling Detail API with payload:', payload);
        const response = await API('report.bmppIndividualBisnis.detail', { data: payload });
        console.log('Detail API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('Detail API error:', error);
        throw error;
      }
    },
    queryKey: ['report-bmpp-individual-bisnis-detail', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportBmppIndividualBisnisDetail;
