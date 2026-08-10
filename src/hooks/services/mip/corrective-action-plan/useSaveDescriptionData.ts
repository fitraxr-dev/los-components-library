import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveDescriptionData = ({
  onSuccess = (data: any) => {},
  onError = (error: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, unknown, any>({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('mip.correctiveActionPlan.save', {
          data: payload,
        });
        console.log('API response:', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['get-corrective-action-plan-bucket-detail'],
      });
      onSuccess(data);
    },
  });

  return mutation;
};

export default useSaveDescriptionData;
