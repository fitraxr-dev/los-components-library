import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DraftMemoControllerApi } from '@/services/openapi/bucket-document-service';

import type { GenerateInitDraftMemoRequestDto } from '@/services/openapi/bucket-document-service';


const api = new DraftMemoControllerApi();

const useGenerateDraftMemo = ({
  onSuccess = () => {},
  onError = (data) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: GenerateInitDraftMemoRequestDto) => {
      const res = await api.generateDraftMemo(payload);

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
            module: variables.module,
            process: variables.process,
          },
        }],
      });
      onSuccess();
    },
  });

  return mutation;
};

export default useGenerateDraftMemo;
