import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MaintenanceShareholderControllerApi } from '@/services/openapi/master-service';

import type { DetailShareholderRequestDto } from '@/services/openapi/master-service';


const master = new MaintenanceShareholderControllerApi();

const useDeleteShareholder = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DetailShareholderRequestDto) => {
      const res = await master.deleteCustomerMaintenanceShareholder(payload);

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
