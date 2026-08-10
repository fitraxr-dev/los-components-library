import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenerateInitDraftMemoRequestDto } from '@/services/openapi/bucket-document-service';

// Extend the type to support ownerId for digital memo
interface RetryGenerateDraftMemoPayload extends GenerateInitDraftMemoRequestDto {
  bucketMasterId?: string;
  ownerId?: string;
  id?: number;
}

const useRetryGenerateDraftMemo = ({
  onSuccess = () => {},
  onError = (data: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RetryGenerateDraftMemoPayload) => {
      const res = await API('bucketDocument.draftMemo.retry', { data: payload });
      return res.data;
    },

    onError: (data) => {
      onError(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['history-draft-memo', {
          filter: {
            bucketProcessId: variables.bucketProcessId,
          },
        }],
      });

      queryClient.invalidateQueries({
        queryKey: ['document-list'],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useRetryGenerateDraftMemo;
