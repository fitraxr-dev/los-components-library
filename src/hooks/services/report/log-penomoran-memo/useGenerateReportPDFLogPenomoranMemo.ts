import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGenerateReportPDFLogPenomoranMemo = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling LogPenomoranMemo PDF API with payload:', payload);
        const response = await API('report.logPenomoranMemo.pdf', { data: { filter: payload } });
        console.log('LogPenomoranMemo PDF API response:', response);
        return response.data;
      } catch (error) {
        console.error('LogPenomoranMemo PDF API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useGenerateReportPDFLogPenomoranMemo;
