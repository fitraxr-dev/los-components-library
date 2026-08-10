import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useAddDocumentEloExisting = ({
  onSuccess = (response: any) => {},
  onError = (error: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('bucketDocument.elo.addExisting', {
        data: payload,
      });

      return res.data.data.content;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: (response: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['documents']});
      queryClient.invalidateQueries({ queryKey: ['document']});
      queryClient.invalidateQueries({ queryKey: ['elo-documents']});
      queryClient.invalidateQueries({ queryKey: ['documents-group']});
      queryClient.invalidateQueries({ queryKey: ['documents-type']});
      onSuccess(response);
    },
  });

  return mutation;
};


export default useAddDocumentEloExisting;
