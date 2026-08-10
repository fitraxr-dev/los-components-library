import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveMemoSupplement = ({
  onSuccess = () => {},
  onError = () => {},
}: any) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Saving Memo Supplement with payload:', payload);

        const response = await API('mip.memoSupplement.save', {
          data: payload,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Save Memo Supplement response:', response);
        return response.data;
      } catch (error) {
        console.error('Error saving Memo Supplement:', error);
        throw error;
      }
    },
    onError,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({
        queryKey: ['memo-supplement', { bucketProcessId: variables.bucketProcessId }],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useSaveMemoSupplement;
