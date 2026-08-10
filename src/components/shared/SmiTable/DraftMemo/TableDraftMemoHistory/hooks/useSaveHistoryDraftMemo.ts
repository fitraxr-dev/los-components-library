import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface DraftMemoRequestSaveMultipart {
  id?: number;
  file?: any;
  documentDate?: string;
  documentName?: string;
  bucketProcessId?: string;
  fileExtension?: string;
  process?: string;
  module?: string;
}

const useSaveHistoryDraftMemo = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DraftMemoRequestSaveMultipart) => {
      const res = await API('bucketDocument.draftMemo.save', {
        data: payload,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
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
