import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGenerateReportPDFLaporanCustomerShareholder = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling PDF API with payload:', payload);
        const response = await API('report.customerManagementShareholder.pdf', { data: { filter: payload } });
        console.log('PDF API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('PDF API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useGenerateReportPDFLaporanCustomerShareholder;
