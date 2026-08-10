import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/agreement-service';

import type { DocumentCreationRequestDto } from '@/services/openapi/agreement-service';


const api = new DocumentControllerApi();

const useSaveDocumentProvision = ({
  onSuccess = (res) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DocumentCreationRequestDto) => {
      const res = await api.createDocumentGroup(payload);
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['documents']});
      onSuccess(res);
    },
  });

  return mutation;
};


export default useSaveDocumentProvision;
