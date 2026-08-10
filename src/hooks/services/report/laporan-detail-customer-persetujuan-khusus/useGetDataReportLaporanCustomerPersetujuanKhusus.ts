import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportLaporanCustomerPersetujuanKhusus = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('report.customerPersetujuanKhusus.search', { data: payload });
        console.log('API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['report-laporan-customer-persetujuan-khusus-data', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportLaporanCustomerPersetujuanKhusus;
