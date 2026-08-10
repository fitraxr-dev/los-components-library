import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGenerateReportPDFLaporanCustomerGroup = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling CustomerGroup PDF API with payload:', payload);
        const response = await API('report.customerGroup.pdf', { data: { filter: payload } });
        console.log('CustomerGroup PDF API response:', response);
        return response.data;
      } catch (error) {
        console.error('CustomerGroup PDF API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useGenerateReportPDFLaporanCustomerGroup;
