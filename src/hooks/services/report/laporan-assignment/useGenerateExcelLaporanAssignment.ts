import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGenerateExcelLaporanAssignment = (
  config?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await API('report.reassignment.excel', { data: payload });
      return response.data;
    },
    ...config,
  });

  return mutation;
};

export default useGenerateExcelLaporanAssignment;
