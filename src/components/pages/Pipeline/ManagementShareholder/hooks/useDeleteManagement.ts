import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomerManagementControllerApi } from '@/services/openapi/bucket-service';

import type { CustomerManagementRequestDto } from '@/services/openapi/bucket-service';


const master = new CustomerManagementControllerApi();

const useDeleteManagement = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CustomerManagementRequestDto) => {
      const res = await master.deleteCustomerManagement(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['management-list']});
    },
  });

  return mutation;
};


export default useDeleteManagement;
