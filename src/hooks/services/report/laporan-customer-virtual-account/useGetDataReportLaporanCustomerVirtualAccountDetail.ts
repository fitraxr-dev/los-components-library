import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportLaporanCustomerVirtualAccountDetail = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling Detail API with payload:', payload);
        const response = await API('report.customerVirtualAccount.detail', { data: payload });
        console.log('Detail API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('Detail API error:', error);
        throw error;
      }
    },
    queryKey: ['report-laporan-customer-virtual-account-detail', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportLaporanCustomerVirtualAccountDetail;
