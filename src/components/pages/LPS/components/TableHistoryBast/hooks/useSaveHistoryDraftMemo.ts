import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DraftMemoControllerApi } from '@/services/openapi/bucket-document-service';

import type { DraftMemoRequestSave } from '@/services/openapi/bucket-document-service';


const api = new DraftMemoControllerApi();

type SaveHistoryVariables = {
  bucketProcessId: string;
  payload: DraftMemoRequestSave;

}
const useSaveHistoryDraftMemo = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload }: SaveHistoryVariables) => {
      const res = await api.saveDraftMemo(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables: SaveHistoryVariables) => {
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

export default useSaveHistoryDraftMemo;
