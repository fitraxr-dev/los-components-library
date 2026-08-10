import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useDeleteSubData = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling API deleteCorrectiveActionPlan with payload:', payload);
        const response = await API('mip.correctiveActionPlan.delete', {
          data: payload,
        });
        console.log('API response (deleteCorrectiveActionPlan):', response);
        return response?.data;
      } catch (error) {
        console.error('API error (deleteCorrectiveActionPlan):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-corrective-action-plan-bucket']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteSubData;
