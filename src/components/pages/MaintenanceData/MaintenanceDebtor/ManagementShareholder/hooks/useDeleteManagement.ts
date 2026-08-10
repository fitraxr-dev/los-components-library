import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MaintenanceManagementControllerApi } from '@/services/openapi/master-service';

import type { DetailManagementRequestDto } from '@/services/openapi/master-service';


const master = new MaintenanceManagementControllerApi();

const useDeleteManagement = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DetailManagementRequestDto) => {
      const res = await master.deleteCustomerMaintenanceManagement(payload);

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
