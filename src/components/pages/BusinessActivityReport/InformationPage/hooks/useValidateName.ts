import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type { ValidateDebtorRequestDto, ValidateDebtorResponseDto } from '@/services/openapi/master-service';


const api = new DebtorV2ControllerApi();

const useValidateName = ({
  onSuccess = (response: ValidateDebtorResponseDto, payload) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: ValidateDebtorRequestDto) => {
      const res = await api.validateDebtorName(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: async (data: ValidateDebtorResponseDto, variables) => {
      queryClient.invalidateQueries({ queryKey: ['validate-debtor-detail']});
      await onSuccess(data, variables);
    },
  });

  return mutation;
};

export default useValidateName;
