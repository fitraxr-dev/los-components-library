import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveAttachment = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Saving attachment with payload:', payload);
        const response = await API('bucketDocument.proposal.submitAttachment', {
          data: payload,
        });
        console.log('Save attachment response:', response);
        return response.data;
      } catch (error) {
        console.error('Error saving attachment:', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      console.log('Attachment saved successfully, invalidating related queries...');
      queryClient.invalidateQueries({
        queryKey: [
          'attachment-list',
          {
            filter: {
              bucketProcessId: variables.bucketProcessId,
              documentParent: variables.documentParent,
            },
          },
        ],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useSaveAttachment;
