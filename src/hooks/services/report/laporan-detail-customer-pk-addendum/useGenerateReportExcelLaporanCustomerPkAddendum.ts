import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGenerateReportExcelLaporanCustomerPkAddendum = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling Excel API with payload:', payload);
        const response = await API('report.customerPkAddendum.excel', { data: { filter: payload } });
        console.log('Excel API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('Excel API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useGenerateReportExcelLaporanCustomerPkAddendum;
