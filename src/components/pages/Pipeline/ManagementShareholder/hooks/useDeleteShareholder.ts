import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomerShareholderControllerApi } from '@/services/openapi/bucket-service';

import type { CustomerShareholderRequestDto } from '@/services/openapi/bucket-service';


const master = new CustomerShareholderControllerApi();

const useDeleteShareholder = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CustomerShareholderRequestDto) => {
      const res = await master.deleteCustomerShareholder(payload);

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
