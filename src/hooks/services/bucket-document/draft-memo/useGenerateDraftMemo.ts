import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenerateInitDraftMemoRequestDto } from '@/services/openapi/bucket-document-service';


const useGenerateDraftMemo = ({
  onSuccess = (variables) => {},
  onError = (error) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: GenerateInitDraftMemoRequestDto) => {
      try {
        console.log('Generating Draft Memo with payload:', payload);
        const response = await API('bucketDocument.draftMemo.generate', {
          data: payload,
        });
        console.log('Draft Memo generated successfully:', response);
        return response.data;
      } catch (error) {
        console.error('Error generating Draft Memo:', error);
        throw error;
      }
    },

    onError: (error) => {
      console.error('Draft Memo generation failed:', error);
      onError(error);
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

      onSuccess(variables);
    },
  });

  return mutation;
};

export default useGenerateDraftMemo;
