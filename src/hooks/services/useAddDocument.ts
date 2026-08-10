import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { DocumentCreationRequestDto } from '@/services/openapi/bucket-document-service';


const api = new DocumentControllerApi();

const useAddDocument = ({
  onSuccess = (response: any) => {},
  onError = (error: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DocumentCreationRequestDto) => {
      const res = await API('bucketDocument.document.createDocumentGroup', {
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
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
      queryClient.invalidateQueries({ queryKey: ['lpa-list']});
      console.log('response', response);
      onSuccess(response);
    },
  });

  return mutation;
};


export default useAddDocument;
