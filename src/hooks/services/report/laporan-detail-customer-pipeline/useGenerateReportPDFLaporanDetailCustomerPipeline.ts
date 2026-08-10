import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGenerateReportPDFLaporanDetailCustomerPipeline = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling Pipeline PDF API with payload:', payload);
        const response = await API('report.customerPipeline.pdf', { data: { filter: payload } });
        console.log('Pipeline PDF API response:', response);
        return response.data;
      } catch (error) {
        console.error('Pipeline PDF API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useGenerateReportPDFLaporanDetailCustomerPipeline;
