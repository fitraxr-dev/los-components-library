import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useDeleteDocument = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload }: any) => {
      try {
        console.log('Delete Document Group with payload:', payload);
        const response = await API('bucketDocument.document.deleteDocumentGroup', {
          data: payload,
        });
        console.log('API response:', response);
        return response.data?.data?.content;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents']});
      queryClient.invalidateQueries({ queryKey: ['document']});
      queryClient.invalidateQueries({ queryKey: ['elo-documents']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteDocument;
