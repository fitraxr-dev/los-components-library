import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetHistoryLaporanDetailCustomer = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling History API with payload:', payload);
        const response = await API('report.customer.history', { data: payload });
        console.log('History API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('History API error:', error);
        throw error;
      }
    },
    queryKey: ['report-laporan-detail-customer-history', payload],
    ...config,
  });

  return query;
};

export default useGetHistoryLaporanDetailCustomer;
