import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MaintenanceDebtorControllerApi } from '@/services/openapi/master-service';

import type { DebtorDescriptionRequest } from '@/services/openapi/master-service';


const api = new MaintenanceDebtorControllerApi();

const useSaveDebitorRemark = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: DebtorDescriptionRequest) => {
      const res = await api.saveDescriptionDebtor(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debtor-description']});
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useSaveDebitorRemark;
