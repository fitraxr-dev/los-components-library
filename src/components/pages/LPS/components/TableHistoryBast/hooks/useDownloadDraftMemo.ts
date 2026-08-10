import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DraftMemoControllerApi } from '@/services/openapi/bucket-document-service';

import type { DraftMemoRequestSave } from '@/services/openapi/bucket-document-service';


const api = new DraftMemoControllerApi();

const useDownloadDraftMemo = ({
  onSuccess = (data) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DraftMemoRequestSave) => {
      const res = await api.getDownloadDraftMemo(payload, { responseType: 'blob' });
      return res;
    },

    onError: () => {
      onError();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pdf-memo-raw-binary', {
          filter: {
            bucketProcessId: variables.bucketProcessId,
          },
        }],
      });
      onSuccess(data);
    },
  });

  return mutation;
};

export default useDownloadDraftMemo;
