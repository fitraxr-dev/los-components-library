import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useDeleteAttachment = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Deleting attachment with payload:', payload);
        const response = await API('bucketDocument.proposal.deleteAttachment', {
          data: payload,
        });
        console.log('Delete attachment response:', response);
        return response.data;
      } catch (error) {
        console.error('Error deleting attachment:', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      console.log('Attachment deleted successfully, invalidating related queries...');
      queryClient.invalidateQueries({
        queryKey: ['attachment-list'],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteAttachment;
