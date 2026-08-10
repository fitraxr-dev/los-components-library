import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { DraftMemoRequestSave } from '@/services/openapi/bucket-document-service';


const useDownloadDraftMemo = ({
  onSuccess = (data) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DraftMemoRequestSave) => {
      const res = await API('bucketDocument.draftMemo.downloadDraftMemo', { data: payload, responseType: 'blob' });
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
