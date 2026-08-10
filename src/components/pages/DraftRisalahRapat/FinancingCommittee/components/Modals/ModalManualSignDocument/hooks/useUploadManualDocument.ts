import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { DocumentCreationRequestDto } from '@/services/openapi/bucket-document-service';
import type { UseMutationOptions } from '@tanstack/react-query';


const useUploadManualDocument = ({
  onSuccess,
  ...config
}: Partial<UseMutationOptions<DocumentCreationRequestDto, any, any>>) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DocumentCreationRequestDto) => {
      const res = await API('bucketDocument.document.risalahRapatManualUpload', {
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data?.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['documents']});
      queryClient.invalidateQueries({ queryKey: ['document']});
      queryClient.invalidateQueries({ queryKey: ['elo-documents']});
      queryClient.invalidateQueries({ queryKey: ['documents-group']});
      queryClient.invalidateQueries({ queryKey: ['documents-type']});
      queryClient.invalidateQueries({ queryKey: ['lpa-list']});
      queryClient.invalidateQueries({ queryKey: ['history-draft-memo']});
      onSuccess?.(data, variables, context);
    },
    ...config,
  });

  return mutation;
};

export default useUploadManualDocument;
