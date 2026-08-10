import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useDownloadReportLogEndOfDay = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling Download API with payload:', payload);
        const response = await API('report.logEndofDay.download', {
          data: { id: payload },
          responseType: 'blob',
        });
        console.log('Download API response:', response);
        return response;
      } catch (error) {
        console.error('Download API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useDownloadReportLogEndOfDay;
