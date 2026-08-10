import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveConcernBusinessResponse = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling API saveConcernBusinessResponse with payload:', payload);
        const response = await API('mip.concern.saveBusinessResponse', {
          data: payload,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('API response (saveConcernBusinessResponse):', response);
        return response?.data;
      } catch (error) {
        console.error('API error (saveConcernBusinessResponse):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables: any) => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: [
          'concern-list',
          {
            bucketProcessId: variables.bucketProcessId,
            module: variables.module,
            process: variables.process,
            type: variables.type,
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['concern-detail', { id: variables.id }],
      });
    },
  });

  return mutation;
};

export default useSaveConcernBusinessResponse;
