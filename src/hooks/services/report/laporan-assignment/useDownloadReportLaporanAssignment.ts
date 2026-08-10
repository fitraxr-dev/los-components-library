import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useDownloadReportLaporanAssignment = (
  config?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await API('report.reassignment.download', {
        data: {
          id,
          watermark: '',
        },
        responseType: 'blob',
      });
      return response;
    },
    ...config,
  });

  return mutation;
};

export default useDownloadReportLaporanAssignment;
