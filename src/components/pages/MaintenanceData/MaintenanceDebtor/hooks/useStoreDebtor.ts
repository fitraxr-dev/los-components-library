import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MaintenanceDebtorControllerApi } from '@/services/openapi/master-service';

import type { MaintenanceDebtorRequest } from '@/services/openapi/master-service';


const api = new MaintenanceDebtorControllerApi();

const useStoreDebtor = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: MaintenanceDebtorRequest) => {
      const res = await api.storeDebtorData(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['get-debtor-detail', variable]});
      onSuccess();
    },
  });

  return mutation;
};

export default useStoreDebtor;
