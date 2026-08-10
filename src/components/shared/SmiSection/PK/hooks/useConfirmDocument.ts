import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoLong } from '@/services/openapi/agreement-service';


const api = new DocumentControllerApi();

const useConfirmDocument = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.checkConfirm(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['document-group-all-pk']});
      onSuccess(data);
    },
  });

  return mutation;
};


export default useConfirmDocument;
