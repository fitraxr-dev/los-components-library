import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGenerateReportCSVBasAsParticipant = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling CSV API with payload:', payload);
        const response = await API('report.basAsParticipant.csv', { data: { filter: payload } });
        console.log('CSV API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('CSV API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useGenerateReportCSVBasAsParticipant;
