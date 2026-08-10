import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGeneratePDFAgingReportProsesPembiayaan = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Generating PDF report for BAS AS Participant with payload:', payload);
        const response = await API('report.agingReportProsesPembiayaan.pdf', { data: { filter: payload } });
        console.log('PDF generation response:', response);
        return response.data;
      } catch (error) {
        console.error('PDF generation error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useGeneratePDFAgingReportProsesPembiayaan;
