import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MaintenanceCapitalControllerApi } from '@/services/openapi/master-service';

import type { MaintenanceCapitalRequest } from '@/services/openapi/master-service';


const api = new MaintenanceCapitalControllerApi();

const useSaveMaintenanceDataModal = ({
  onSuccess = (data?: any) => { },
  onError = () => { },
  invalidateOnSuccess = false,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: MaintenanceCapitalRequest) => {
      const res = await api.saveCapital(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      onSuccess(data);
      if (invalidateOnSuccess) {
        queryClient.invalidateQueries({ queryKey: ['get-capital-detail']});
      }
    },
  });

  return mutation;
};

export default useSaveMaintenanceDataModal;
