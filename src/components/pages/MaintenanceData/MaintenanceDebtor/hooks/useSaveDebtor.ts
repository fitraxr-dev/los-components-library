import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DebtorControllerApi } from '@/services/openapi/loan-service';

import type { UpdateDebtorRequestDto } from '@/services/openapi/loan-service';


const api = new DebtorControllerApi();

const useSaveDebtor = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: UpdateDebtorRequestDto) => {
      const res = await api.saveDebtor(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debtor']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveDebtor;
