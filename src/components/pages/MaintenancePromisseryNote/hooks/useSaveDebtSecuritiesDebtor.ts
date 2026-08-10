import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DebtSecuritiesControllerApi } from '@/services/openapi/master-service';

import type { DebtSecuritiesRequestDto } from '@/services/openapi/master-service';


const api = new DebtSecuritiesControllerApi();

const useSaveDebtSecuritiesDebtor = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DebtSecuritiesRequestDto) => {
      const res = await api.saveDebtSecuritiesDebtor(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['get-list-debt-securities']});
    },
  });

  return mutation;
};

export default useSaveDebtSecuritiesDebtor;
