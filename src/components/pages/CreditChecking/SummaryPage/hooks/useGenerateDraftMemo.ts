import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DraftMemoControllerApi } from '@/services/openapi/mip-service';

import type { DraftMemoGenerateRequest } from '@/services/openapi/mip-service';


const api = new DraftMemoControllerApi();

const useGenerateDraftMemo = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DraftMemoGenerateRequest) => {
      const res = await api.generateDraftMemo(payload);

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

export default useGenerateDraftMemo;
