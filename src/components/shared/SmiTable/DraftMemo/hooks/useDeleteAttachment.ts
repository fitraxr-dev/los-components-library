import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProposalAttachmentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  ListProposalAttachmentRequestDtoDocumentParentEnum,
  RequestByIdDtoLong,
} from '@/services/openapi/bucket-document-service';


const api = new ProposalAttachmentControllerApi();

type DeleteDraftMemoVariables = {
  documentParent: ListProposalAttachmentRequestDtoDocumentParentEnum;
  bucketProcessId: string;
  payload: RequestByIdDtoLong;
}

const useDeleteAttachment = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload }: DeleteDraftMemoVariables) => {
      const res = await api.deleteProposalAttachment(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables: DeleteDraftMemoVariables) => {
      queryClient.invalidateQueries({
        queryKey: ['attachment-list', {
          filter: {
            bucketProcessId: variables.bucketProcessId,
            documentParent: variables.documentParent,
          },
        }],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteAttachment;
