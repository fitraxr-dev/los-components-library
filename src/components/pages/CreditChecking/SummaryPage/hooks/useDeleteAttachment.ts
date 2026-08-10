import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProposalControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new ProposalControllerApi();

type DeleteDraftMemoVariables = {
  documentGroup: string;
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
            documentGroup: variables.documentGroup,
          },
        }],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteAttachment;
