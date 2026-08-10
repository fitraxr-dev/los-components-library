import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGenerateReportPDFLaporanDetailCustomerSiteVisit = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling Site Visit PDF API with payload:', payload);
        const response = await API('report.customerSiteVisit.pdf', { data: { filter: payload } });
        console.log('Site Visit PDF API response:', response);
        return response.data;
      } catch (error) {
        console.error('Site Visit PDF API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useGenerateReportPDFLaporanDetailCustomerSiteVisit;
