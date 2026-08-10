import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type { UpdateDebtorRequestDto } from '@/services/openapi/master-service';


const api = new DebtorV2ControllerApi();

const useSaveDebtor = ({
  onSuccess = () => { },
  onError = () => { },
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
