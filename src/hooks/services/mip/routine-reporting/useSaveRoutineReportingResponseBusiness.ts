import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveRoutineReportingResponseBusiness = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, unknown, any>({
    mutationFn: async ({ id, businessResponse }: any) => {
      try {
        console.log('Calling API (mip) saveRoutineReportingBusinessResponse with payload:', {
          businessResponse,
          id,
        });

        const response = await API('mip.routineReporting.saveBusinessResponse', {
          data: { businessResponse, id },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('API response (saveRoutineReportingBusinessResponse):', response);
        return response?.data;
      } catch (error) {
        console.error('API error (saveRoutineReportingBusinessResponse):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-list-routine-reporting']});
      queryClient.invalidateQueries({ queryKey: ['get-detail-routine-reporting']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveRoutineReportingResponseBusiness;
