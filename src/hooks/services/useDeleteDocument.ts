import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
  RequestByIdDtoLong,
} from '@/services/openapi/bucket-document-service';


type DeleteDocumentVariables = {
  documentParent?: DocumentTypeRequestDtoDocumentParentEnum;
  ownership?: DocumentTypeRequestDtoOwnershipEnum;
  bucketProcessId?: string;
  payload: RequestByIdDtoLong;
}

const api = new DocumentControllerApi();

const useDeleteDocument = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload }: DeleteDocumentVariables) => {
      const res = await api.deleteDocumentGroup(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['documents']});
      queryClient.invalidateQueries({ queryKey: ['document']});
      queryClient.invalidateQueries({ queryKey: ['elo-documents']});
      queryClient.invalidateQueries({ queryKey: ['lpa-list']});
    },
  });

  return mutation;
};


export default useDeleteDocument;
