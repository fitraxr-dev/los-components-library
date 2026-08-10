import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DebtSecuritiesControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoLong } from '@/services/openapi/master-service';


const api = new DebtSecuritiesControllerApi();

const useDeleteDebtSecuritiesDebtor = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteDebtSecuritiesDebtor(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-list-debt-securities']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteDebtSecuritiesDebtor;
