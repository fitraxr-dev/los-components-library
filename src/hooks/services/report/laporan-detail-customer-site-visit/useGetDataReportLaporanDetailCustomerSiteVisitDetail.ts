import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportLaporanDetailCustomerSiteVisitDetail = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling Detail API with payload:', payload);
        const response = await API('report.customerSiteVisit.detail', { data: payload });
        console.log('Detail API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('Detail API error:', error);
        throw error;
      }
    },
    queryKey: ['report-laporan-detail-customer-site-visit-detail', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportLaporanDetailCustomerSiteVisitDetail;
