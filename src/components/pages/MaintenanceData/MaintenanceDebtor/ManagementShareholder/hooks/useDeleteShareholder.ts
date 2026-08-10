import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ShareholderControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoLong } from '@/services/openapi/master-service';


const master = new ShareholderControllerApi();

const useDeleteShareholder = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await master.deleteShareholderById(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['shareholders-list']});
    },
  });

  return mutation;
};


export default useDeleteShareholder;
