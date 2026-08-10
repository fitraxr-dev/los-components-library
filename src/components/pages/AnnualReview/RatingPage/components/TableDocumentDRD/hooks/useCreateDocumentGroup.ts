import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/mip-service';

import type { DocumentCreationRequestDto } from '@/services/openapi/mip-service';


const api = new DocumentControllerApi();

const useCreateDocumentGroup = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DocumentCreationRequestDto) => {
      const res = await api.saveDocumentGroup(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['list-document-group-rating']});
    },
  });

  return mutation;
};


export default useCreateDocumentGroup;
