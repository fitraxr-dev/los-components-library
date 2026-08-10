import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  BaseResponseGenericSingleDtoDocumentCreationResponseDto,
  DocumentCreationRequestDto,
} from '@/services/openapi/bucket-document-service';


const api = new DocumentControllerApi();

const useSaveDocumentProvision = ({
  onSuccess = (res) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DocumentCreationRequestDto) => {
      const res = await api.createDocumentGroup(payload);
      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['documents']});
      // queryClient.invalidateQueries({ queryKey: ['document', { id: variables.id }]});
      onSuccess(res);
    },
  });

  return mutation;
};


export default useSaveDocumentProvision;
