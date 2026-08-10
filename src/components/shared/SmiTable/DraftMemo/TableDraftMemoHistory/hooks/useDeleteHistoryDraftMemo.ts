import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DraftMemoControllerApi } from '@/services/openapi/bucket-document-service';

import type { RequestByIdDtoLong } from '@/services/openapi/bucket-document-service';


const api = new DraftMemoControllerApi();

type DeleteDraftMemoVariables = {
  bucketProcessId: string;
  payload: RequestByIdDtoLong;
}

const useDeleteHistoryDraftMemo = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload }: DeleteDraftMemoVariables) => {
      const res = await api.deleteDraftMemo(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables: DeleteDraftMemoVariables) => {
      queryClient.invalidateQueries({
        queryKey: ['history-draft-memo', {
          filter: {
            bucketProcessId: variables.bucketProcessId,
          },
        }],
      });
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteHistoryDraftMemo;
