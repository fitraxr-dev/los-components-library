import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveCapDescriptionBusinessResponse = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {

  const mutation = useMutation<any, unknown, any>({
    mutationFn: async (payload: any) => {
      try {
        const response = await API('mip.correctiveActionPlan.saveBusinessResponseNew', {
          data: payload,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('API response:', response);
        return response?.data?.data?.contents;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variables) => {
      onSuccess(data);
    },
  });

  return mutation;
};

export default useSaveCapDescriptionBusinessResponse;
