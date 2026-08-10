import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AccountBankControllerApi } from '@/services/openapi/mip-service';

import type {
  BaseResponseGenericSingleDtoAccountBankResponseDto,
  AccountBankRequestDto,
} from '@/services/openapi/mip-service';


const api = new AccountBankControllerApi();

const useDeleteAccountInformation = ({
  onSuccess = (res: BaseResponseGenericSingleDtoAccountBankResponseDto) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AccountBankRequestDto) => {
      const res = await api.softDeleteAccountBank(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({ queryKey: ['account-information-list']});
      queryClient.invalidateQueries({ queryKey: ['summary-account-information-list']});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useDeleteAccountInformation;
