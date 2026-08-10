import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoLong } from '@/services/openapi/agreement-service';


const api = new DocumentControllerApi();

const useDeleteDocument = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteDocumentById(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-group-all-pk']});
      onSuccess();
    },
  });

  return mutation;
};


export default useDeleteDocument;
