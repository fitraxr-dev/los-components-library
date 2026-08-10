import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  DocumentCreationRequestDto,
  DocumentCreationResponseDto,
} from '@/services/openapi/bucket-document-service';


const api = new DocumentControllerApi();

const useSaveDocumentFile = ({
  onSuccess = () => {},
  onError = () => {},
}: {onSuccess: (res: DocumentCreationResponseDto) => void; onError?: () => void}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DocumentCreationRequestDto) => {
      const res = await api.saveDocumentGroup(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents']});
      queryClient.invalidateQueries({ queryKey: ['elo-documents']});
      // queryClient.invalidateQueries({ queryKey: ['document', { id: variables.id }]});
      onSuccess(res);
    },
  });

  return mutation;
};


export default useSaveDocumentFile;
