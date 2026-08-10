import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ShareholderControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByIdDtoLong } from '@/services/openapi/bucket-service';


type useDeleteShareholderVariables = {
  debtorId: string;
  payload: RequestByIdDtoLong;
};

const api = new ShareholderControllerApi();

const useDeleteShareholder = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload }: useDeleteShareholderVariables) => {
      const res = await api.deleteShareholderById(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['shareholders']});
      queryClient.invalidateQueries({ queryKey: ['shareholder']});
    },
  });

  return mutation;
};


export default useDeleteShareholder;
